const { execFile } = require('child_process');
const path = require('path');

// Helper to run the python script
const runPythonPrediction = (inputData) => {
    return new Promise((resolve, reject) => {
        const scriptPath = path.resolve(__dirname, '../../Career_Advisor/predict.py');
        const inputJson = JSON.stringify(inputData);
        
        // Execute the python script passing the JSON string as an argument
        // Using python/python3 based on environment, usually 'python' on windows
        execFile('python', [scriptPath, inputJson], (error, stdout, stderr) => {
            if (error) {
                console.error("Python exec error:", error);
                return reject(error);
            }
            try {
                // Stdout should just be our JSON string from predict.py
                const result = JSON.parse(stdout.trim());
                if (!result.success) {
                    return reject(new Error(result.error));
                }
                resolve(result);
            } catch (parseError) {
                console.error("Failed to parse Python output:", stdout, parseError);
                reject(new Error("Invalid output from AI service."));
            }
        });
    });
};

exports.getCareerAdvice = async (req, res) => {
    try {
        const userStats = req.body;
        // Expected userStats: projects, certifications, hs_per, field_study, internships, soft_skills, uni_gpa, target_salary
        
        // 1. Get Predicted Salary from Python local script
        const prediction = await runPythonPrediction(userStats);
        
        // 2. Format Context and query OpenRouter
        const { expected_salary_min, expected_salary_max } = prediction;
        
        // Determine strengths and weaknesses mimicking original logic
        let weak_areas = [], strength_areas = [];
        if (userStats.projects < 3) weak_areas.push("limited project experience");
        else strength_areas.push("good project experience");
        if (userStats.internships < 3) weak_areas.push("low industry exposure");
        else strength_areas.push("strong industry exposure");
        if (userStats.certifications < 3) weak_areas.push("few certifications");
        else strength_areas.push("diverse technical certifications");
        if (userStats.soft_skills < 7) weak_areas.push("soft skills need improvement");
        else strength_areas.push("strong interpersonal skills");
        if (userStats.hs_per < 85) weak_areas.push("average high school academics");
        else strength_areas.push("solid high school academics");
        if (userStats.uni_gpa < 8) weak_areas.push("moderate university GPA");
        else strength_areas.push("high university GPA");

        const strength_summary = strength_areas.join(" and ");
        const weakness_summary = weak_areas.join(" and ");

        const user_context = `The user has the following profile:
- Projects: ${userStats.projects}
- Internships: ${userStats.internships}
- Certifications: ${userStats.certifications}
- Soft Skills: ${userStats.soft_skills}
- High School %: ${userStats.hs_per}
- University GPA: ${userStats.uni_gpa}
- Field: ${userStats.field_study}
Strengths: ${strength_summary}
Weaknesses: ${weakness_summary}`;

        let prompt = "";
        const target_salary = parseFloat(userStats.target_salary || 0);

        if (target_salary > expected_salary_max) {
            prompt = `${user_context}
The user's target salary ₹${target_salary.toLocaleString()} is **higher than the expected range** of ₹${Math.round(expected_salary_min).toLocaleString()} – ₹${Math.round(expected_salary_max).toLocaleString()}.
Consider students profile, strengths and weaknesses and Suggest **5 technical skills** and **5 soft skills** the user should improve to enhance their chances of reaching their target salary.
Be motivational but practical. Avoid generic advice and be concise.
While mentioning technical skills, mention the software and technology if required`;
        } else {
            prompt = `${user_context}
The user's target salary ₹${target_salary.toLocaleString()} is **within or below** the expected range of ₹${Math.round(expected_salary_min).toLocaleString()} – ₹${Math.round(expected_salary_max).toLocaleString()}.
Consider students profile, strengths and weaknesses and Still, suggest **5 technical skills** and **5 soft skills** they can work on to maximize career growth. Consider students profile and suggets based on that
Be motivational but practical. Avoid generic advice and be concise
While mentioning technical skills, mention the software and technology if required`;
        }

        // Call OpenRouter
        const openRouterKey = process.env.OPENROUTER_API_KEY;
        if (!openRouterKey) {
            return res.status(500).json({ message: "OPENROUTER_API_KEY is not configured on the server." });
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${openRouterKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "openrouter/free",
                "messages": [
                    { "role": "system", "content": "You are a career advisor providing specific actionable advice." },
                    { "role": "user", "content": prompt }
                ]
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!openRouterResponse.ok) {
            const errBody = await openRouterResponse.text();
            throw new Error(`OpenRouter API Error: ${openRouterResponse.status} - ${errBody}`);
        }

        const openRouterData = await openRouterResponse.json();
        const aiMessage = openRouterData.choices[0].message.content;

        res.status(200).json({
            expected_salary_min,
            expected_salary_max,
            advice: aiMessage
        });

    } catch (error) {
        console.error("AI Controller Error:", error);
        res.status(500).json({ message: error.message || "Failed to generate career advice." });
    }
};
