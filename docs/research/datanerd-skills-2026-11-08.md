# Skills emphasis for the personal architecture site

Checked on 2026-11-08. The purpose is to prioritise verified experience in the site's glass architecture, rather than turn vacancy salary medians into claims about an individual's pay.

## DataNerd observation

Source: https://datanerd.tech/skills?title=Senior+Data+Engineer&country=United+States&view=skill-value-map

Filters observed in the live UI: Senior Data Engineer; United States; Last Year; all job types; all skill categories; Optimal Skills view. The UI showed approximately 47.1K matched job postings. It did not expose a separate salary-sample count in the tooltips.

| Technology mentioned in the CV | Job-posting share | Median salary shown, USD/year |
| --- | ---: | ---: |
| Java | 21.4% | 184,500 |
| Python | 70.9% | 168,000 |
| Airflow | 21.2% | 166,700 |
| Spark | 45.1% | 163,900 |
| SQL | 73.4% | 163,900 |
| Kafka | 22.5% | 162,200 |

The UI named SQL the most optimal skill for demand plus salary in this filtered view. These are observations about vacancies mentioning a skill, with overlapping skill combinations; they are not the salary effect of learning one tool or a personal compensation estimate.

The site's methodology says it extracts and normalises daily Google Jobs postings through SerpApi. Its coverage notice reports gaps in several markets since December 2025 and stronger coverage for the US, UK, Canada, India, and Singapore. Therefore this US slice is a directional reference, not a Cyprus or worldwide salary benchmark.

Methodology and coverage: https://datanerd.tech/about

## Evidence and presentation

The user-supplied four-page CV was read and its relevant pages visually inspected. No copy of the PDF or contact details is added to the repository.

- Python, SQL, Kafka and Airflow: Sber; Python, Spark, Kafka and Airflow also appear in the Gazprom Neft stack.
- User correction: Java appears in project technology lists, but Denis designed systems using it and does not claim Java programming proficiency. The historical salary observation above remains a market statistic; Java is excluded from the website's personal programming presentation.
- User addition: practical AWS experience from a personal home project. That scope is identified without inventing services, certifications, or employer deployments.
- ClickHouse: ADVIVA's NRT pipelines, approximately 50 TB of compressed data with the DWH Core Team; also present in earlier project stacks.
- Greenplum and Data Vault 2.0: Sber's layered data platform and warehouse modelling.
- Kubernetes, Docker, NiFi and PostgreSQL/PostGIS: explicitly present in the CV.
- Kubeflow, KServe and MLflow: explicitly present in the Sber experience, including a data sandbox and inference.
- Kafka Connect and CDC: explicitly named by the user in this conversation. No specific CDC implementation or employer association is invented.
- The context layer describes data modelling, governance, data lifecycle and MDM as foundations for AI context. It does not claim a deployed retrieval/RAG product.

The five layers combine experience across projects. Deep views link to the corresponding career entries. Airflow is shown as workflow orchestration; Python and SQL form the visible engineering foundation. AWS is a separate personal-project node. The website does not display salary figures or label unverified cloud products as personal experience.
