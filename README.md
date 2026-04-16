# E-Detect — Phishing Detection & Awareness Toolkit

A Flask-based cybersecurity project that analyzes email content and attachments to detect phishing indicators and educates users through an awareness module.

> **Purpose:** Educational and defensive tool to demonstrate how phishing can be detected using explainable, rule-based analysis (not a black-box ML model).

---

## 📌 What This Project Does

E-Detect allows a user to:

1. Paste a suspicious email (headers + body)
2. Upload optional attachments
3. Click **Analyze**
4. Instantly receive:

   * Risk Score (0–100)
   * Risk Level (SAFE / SUSPICIOUS / HIGH RISK)
   * Confidence level
   * Detailed reasons (explainable indicators)

It also provides an **Awareness page** that educates users about phishing warning signs and safe practices.

---


```




### 1. Email Content Analysis

It scans for phishing-related keywords such as:

* password
* verify
* login
* urgent
* account suspended
* OTP

Each keyword adds risk points.

---

### 2. URL Analysis

If the email contains links, the system checks for:

* IP-based URLs instead of domains
* Non-HTTPS links
* URL shorteners (bit.ly, tinyurl)
* Punycode / homograph attacks
* Misleading subdomains (e.g., paypal.fake-site.com)

Suspicious URLs increase the risk score and are reported to the user.

---

### 3. Header Analysis (If headers are included)

The system looks for:

* From vs Reply-To mismatch
* Display name spoofing (e.g., "PayPal Support [random@gmail.com](mailto:random@gmail.com)")
* Missing subject or malformed headers

This simulates how real-world email security tools inspect metadata.

---

### 4. Attachment Analysis (Static)

Attachments are **not executed**. Only filenames are analyzed safely.

Checks include:

* Dangerous extensions (.exe, .js, .docm, .html)
* Double extensions (invoice.pdf.exe)
* Lure words in filenames (invoice, payment, refund, kyc)
* Simulated advanced checks (macro presence, PDF scripts, HTML harvesting)

This keeps the project safe while demonstrating security concepts.

---

## 📊 Scoring System

Total score is capped at **100**.

| Score Range | Classification |
| ----------- | -------------- |
| 0–29        | SAFE           |
| 30–59       | SUSPICIOUS     |
| 60–100      | HIGH RISK      |

The system also calculates a **confidence level** (LOW / MEDIUM / HIGH) based on how many critical indicators were detected.

---

## 💾 Database Usage

All analyses are stored using SQLite via SQLAlchemy:

Table: `AnalysisResult`

* `email_content`
* `score`
* `classification`
* `issues_detected` (JSON)

This allows future expansion like:

* History page
* Analytics dashboard
* Report export

---


## 🚀 How to Run the Project

```bash
pip install flask flask_sqlalchemy
python app.py
```

Open in browser:

```
http://127.0.0.1:5000
```

---

## 🔐 Security Design Principles Followed

* No file execution (safe static analysis only)
* No external API calls
* No malware processing
* Uploads sanitized
* Explainable output (no hidden logic)

This makes the project safe for:

* College submissions
* Demonstrations
* Cybersecurity portfolios

---

## 🎯 Educational Value

This project demonstrates understanding of:

* Phishing attack techniques
* Social engineering detection
* URL-based attack vectors
* Secure file handling
* Backend security logic
* Web application architecture

---

## 📌 Future Improvements (Optional Scope)

* User login system
* History dashboard
* Export PDF reports
* API version
* Machine learning integration
* Live URL reputation APIs

---

## 👤 Author

**Manish Unecha**
B.Tech CSE | Cybersecurity Enthusiast
Project: *E-Detect — Phishing Detection Toolkit*

---

> ⚠️ Disclaimer: This tool is for educational and defensive


