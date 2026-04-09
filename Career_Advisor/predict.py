import sys
import json
import os
import io

# Optional: Disable tensorflow info/warnings to keep stdout clean for JSON parsing
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 

import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model
import joblib

# Field of study list
field_list = ['Business', 'Computer Science', 'Engineering', 'Law', 'Mathematics', 'Medicine']

# Weight functions
def weight_projects(val):
    if val <= 2: return val * 1.5
    elif val <= 5: return val * 2
    elif val <= 7: return val * 2.5
    else: return val * 3

def weight_internships(val):
    if val == 0: return val * 1.2
    elif val == 1: return val * 1.8
    elif val == 2: return val * 2.2
    else: return val * 2.8

def weight_certifications(val):
    if val <= 1: return val * 1.1
    elif val <= 3: return val * 1.6
    else: return val * 2.1

def weight_soft_skills(val):
    if val <= 3: return val * 1
    elif val <= 6: return val * 1.5
    elif val <= 8: return val * 2
    else: return val * 2.5

def weight_uni_gpa(val):
    if val < 7: return val * 1.2
    elif val <= 8.5: return val * 1.6
    elif val <= 9.2: return val * 2.0
    else: return val * 2.4

def weight_hs_per(val):
    if val < 60: return val * 1.1
    elif val <= 75: return val * 1.5
    elif val <= 90: return val * 1.8
    else: return val * 2.2

def main():
    try:
        # Get the input JSON string from command line argument
        input_data = sys.argv[1]
        data = json.loads(input_data)
        
        projects = float(data.get('projects', 0))
        certifications = float(data.get('certifications', 0))
        hs_per = float(data.get('hs_per', 0))
        field_study_input = data.get('field_study', 'Computer Science')
        internships = float(data.get('internships', 0))
        soft_skills = float(data.get('soft_skills', 0))
        uni_gpa = float(data.get('uni_gpa', 0))
        target_salary = float(data.get('target_salary', 0))

        # Absolute paths for model and scaler logic (assuming run from backend or here)
        base_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(base_dir, "salary_predictor_model.keras")
        scaler_path = os.path.join(base_dir, "scaler1.save")

        model = load_model(model_path, compile=False)
        scaler = joblib.load(scaler_path)

        field_encoding = {
            f"Field_of_Study_{field}": int(field == field_study_input)
            for field in field_list
        }

        w_projects = weight_projects(projects)
        w_internships = weight_internships(internships)
        w_certifications = weight_certifications(certifications)
        w_soft_skills = weight_soft_skills(soft_skills)
        w_hs_per = weight_hs_per(hs_per)
        w_uni_gpa = weight_uni_gpa(uni_gpa)

        gpa_x_projects = w_uni_gpa * projects
        gpa_x_internships = w_uni_gpa * internships

        input_df = pd.DataFrame([{
            'w_Projects_Completed': w_projects,
            'w_Internships_Completed': w_internships,
            'w_Certifications': w_certifications,
            'w_Soft_Skills_Score': w_soft_skills,
            'w_High_School_Per': w_hs_per,
            'w_University_GPA': w_uni_gpa,
            'GPA_x_Projects': gpa_x_projects,
            'GPA_x_Internships': gpa_x_internships,
            **field_encoding
        }])

        input_scaled = scaler.transform(input_df)
        predicted_salary = model.predict(input_scaled, verbose=0)[0][0]
        
        ps1 = float(predicted_salary * 0.3)
        ps2 = float(predicted_salary * 0.5)
        
        result = {
            "success": True,
            "expected_salary_min": ps1,
            "expected_salary_max": ps2
        }
        return json.dumps(result)

    except Exception as e:
        error_result = {
            "success": False,
            "error": str(e)
        }
        return json.dumps(error_result)

if __name__ == "__main__":
    # Redirect stdout to a dummy stream during imports/tf loading to prevent garbage
    original_stdout = sys.stdout
    sys.stdout = io.StringIO()
    
    try:
        res = main()
    finally:
        sys.stdout = original_stdout
        print(res)
