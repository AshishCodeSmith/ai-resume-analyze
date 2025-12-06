from flask import Flask, request, jsonify
from flask_cors import CORS
from extractor import extract_text
from scorer import calculate_ats_score
from suggestions import generate_suggestions
import json

app = Flask(__name__)
CORS(app)   # Allow frontend connection

# Load skills for JD matching
with open("skills.json", "r") as f:
    SKILLS = json.load(f)


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "ATS Resume Analyzer API is running"})


@app.route("/analyze", methods=["POST"])
def analyze_resume():
    """
    API: /analyze
    Method: POST
    Input:
        - resume file (PDF/Docx)
        - jobDesc (text)
    Output:
        - ATS Score
        - Skills in JD
        - Skills found in Resume
        - Missing Skills
        - Suggestions
    """

    # Validate file upload
    if "resume" not in request.files:
        return jsonify({"error": "Resume file is required!"}), 400

    file = request.files["resume"]

    # Validate job description
    job_desc = request.form.get("jobDesc", "").strip()
    if not job_desc:
        return jsonify({"error": "Job description is required!"}), 400

    # Extract resume text
    resume_text = extract_text(file).lower()
    job_desc = job_desc.lower()

    # Extract skills from JD
    jd_skills = [skill for skill in SKILLS if skill.lower() in job_desc]

    # Match with resume
    resume_skills = [skill for skill in jd_skills if skill.lower() in resume_text]

    missing_skills = list(set(jd_skills) - set(resume_skills))

    # Score calculation
    score = int((len(resume_skills) / len(jd_skills)) * 100) if jd_skills else 0

    # Suggestions
    _, suggestions = generate_suggestions(resume_skills, jd_skills)

    return jsonify({
        "ATS Score (%)": score,
        "Skills from Job Description": jd_skills,
        "Skills Found in Resume": resume_skills,
        "Missing Skills": missing_skills,
        "Suggestions": suggestions
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)
