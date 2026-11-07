---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

Education
======
- **Tomsk State University of Control Systems and Radioelectronics**  
  _Bachelor’s degree, Software for Computer Engineering and Automated Systems, 2019 – 2024_
- **Siberian Regional Business School**  
  _Computer Engineering and Automated Systems, 2007 – 2011_
- **Yugra State University**  
  _Economics and Accounting, 2007 – 2010_

Certifications
======
- Microsoft Office Specialist
- Learn Python 2
- Low-code Data Analytics

Work experience
======
### **SberEducation**  
**Data Architect**  
- Designed scalable data platform architecture using Greenplum.
- Implemented Data Vault 2.0 and led data lifecycle control discussions.  
_Technologies: Greenplum, Clickhouse, Kafka, Airflow, Kubernetes._

### **Gazprom Neft**  
**Lead of IT Architecture**  
- Developed architecture for critical monitoring solutions.
- Ensured compliance with data governance strategies.  
_Technologies: Python, Java, ClickHouse, Greenplum._

Skills
======
- Domain Architecture
- Data Management
- SQL, Python, Java, Kubernetes

{% if site.publications.size > 0 %}
Publications
======
<ul>{% for post in site.publications reversed %}
  {% include archive-single-cv.html %}
{% endfor %}</ul>
{% endif %}

Talks
======
  <ul>{% for post in site.talks reversed %}
    {% include archive-single-talk-cv.html  %}
  {% endfor %}</ul>
  
{% if site.teaching.size > 0 %}
Teaching
======
<ul>{% for post in site.teaching reversed %}
  {% include archive-single-cv.html %}
{% endfor %}</ul>
{% endif %}
