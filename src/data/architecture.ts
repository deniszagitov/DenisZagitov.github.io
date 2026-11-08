// Based on the user's CV and explicit corrections: Kafka Connect / CDC, plus AWS
// in a personal project. Java is project-stack experience, not a coding skill.
// The context layer expresses the purpose of modelling and governance; it does
// not imply that every technology belonged to one project or a deployed RAG app.
export const architectureLayers = [
  {
    id: 'sources', number: '01', label: 'SOURCES', caption: 'SYSTEMS / SERVICES / EVENTS',
    technologies: [
      { name: 'Oracle', ru: 'Реляционные данные операционных систем. В опыте Shell — ETL, качество данных и справочники MDM.', en: 'Relational data from operational systems. At Shell: ETL, data quality, and MDM directories.' },
      { name: 'SQL Server', ru: 'Данные прикладных систем и интеграции с аналитикой. Опыт работы с MSSQL и SSIS.', en: 'Application data and analytics integration, with experience in MSSQL and SSIS.' },
      { name: 'PostgreSQL / PostGIS', ru: 'Реляционные и пространственные данные для аналитических и геоинформационных решений.', en: 'Relational and spatial data for analytical and geospatial systems.' },
    ],
    experience: ['shell', 'tyumen'],
    ru: { title: 'Системы, сервисы, события', summary: 'Откуда приходят данные: операционные БД, интеграции и события приложений.', detail: 'У каждого источника — свой формат, ритм изменений и правила доступа. Архитектура начинается с понимания этих различий.', example: 'ETL, качество данных, MDM и геоданные в Shell и региональных Data & BI-решениях.' },
    en: { title: 'Systems, services, events', summary: 'Where data begins: operational databases, integrations, and application events.', detail: 'Each source has its own format, update rhythm, and access rules. Architecture starts with understanding those differences.', example: 'ETL, data quality, MDM, and geospatial data at Shell and in regional Data & BI systems.' },
  },
  {
    id: 'ingestion', number: '02', label: 'INGESTION', caption: 'CAPTURE / CONNECT / STREAM',
    technologies: [
      { name: 'Kafka', ru: 'Потоки событий между системами: топики, партиции и независимые потребители данных.', en: 'Event streams between systems: topics, partitions, and independent data consumers.' },
      { name: 'Kafka Connect', ru: 'Среда для source- и sink-коннекторов, связывающих внешние системы с Kafka.', en: 'A runtime for source and sink connectors that link external systems with Kafka.' },
      { name: 'CDC', ru: 'Change Data Capture — получение изменений в данных источника. Конкретный коннектор зависит от системы и задачи.', en: 'Change Data Capture: capturing changes in source data. The connector depends on the source and task.' },
      { name: 'NiFi', ru: 'Управление потоками и интеграциями данных. В технологическом стеке проектов Газпром нефти.', en: 'Data flow and integration management, used in the Gazprom Neft project stack.' },
    ],
    experience: ['sber', 'gazprom-neft'],
    ru: { title: 'Загрузка и потоки изменений', summary: 'Доставляю данные туда, где они нужны, сохраняя связи между системами.', detail: 'Загрузка объединяет получение изменений, потоковую доставку и интеграции. Kafka Connect запускает коннекторы, CDC описывает способ получения изменений, Kafka передаёт события.', example: 'Kafka — в стеке проектов Сбера и Газпром нефти; NiFi — в проектах Газпром нефти.' },
    en: { title: 'Ingestion & change streams', summary: 'Getting data where it is needed while connecting the systems behind it.', detail: 'Ingestion combines change capture, streaming, and integrations. Kafka Connect runs connectors, CDC describes how changes are captured, and Kafka carries events.', example: 'Kafka in the Sber and Gazprom Neft project stacks; NiFi in the Gazprom Neft stack.' },
  },
  {
    id: 'platform', number: '03', label: 'DATA PLATFORM', caption: 'STORE / TRANSFORM / MODEL',
    technologies: [
      { name: 'ClickHouse', ru: 'Колоночная аналитическая СУБД. В ADVIVA — NRT-пайплайны для ≈50 ТБ сжатых данных вместе с DWH Core Team.', en: 'A column-oriented analytical database. At ADVIVA: NRT pipelines for approximately 50 TB of compressed data with the DWH Core Team.' },
      { name: 'Greenplum', ru: 'Распределённое аналитическое хранилище. В Сбере — архитектура ядра платформы и слоистой масштабируемой системы.', en: 'A distributed analytical warehouse. At Sber: architecture of the platform core and a scalable layered system.' },
      { name: 'Spark', ru: 'Распределённая обработка данных. В технологическом стеке архитектурных проектов Газпром нефти.', en: 'Distributed data processing, part of the Gazprom Neft architecture project stack.' },
      { name: 'SQL', ru: 'Модели, преобразования, витрины и работа со связями между данными.', en: 'Models, transformations, data marts, and relationships between data.' },
      { name: 'Data Vault 2.0', ru: 'Подход к моделированию ядра хранилища, применённый в платформе данных Сбера.', en: 'A warehouse modelling approach applied to the core of the Sber data platform.' },
      { name: 'AWS', ru: 'Практический опыт с AWS в личном домашнем проекте.', en: 'Practical AWS experience from a personal home project.' },
    ],
    experience: ['adviva', 'sber', 'gazprom-neft'],
    ru: { title: 'Платформа и модели данных', summary: 'Хранение, распределённая обработка и преобразование данных в полезные модели.', detail: 'Здесь поток становится частью платформы: данные хранятся, преобразуются и связываются в модели и витрины. Технологии отражают опыт разных проектов.', example: 'NRT-платформа ADVIVA; Greenplum и Data Vault 2.0 в Сбере; распределённая обработка в стеке Газпром нефти. AWS — практика в личном проекте.' },
    en: { title: 'Data platform & models', summary: 'Storage, distributed processing, and transformation into useful data models.', detail: 'Streams become a platform: data is stored, transformed, and connected into models and marts. The technologies reflect experience across different projects.', example: 'The ADVIVA NRT platform; Greenplum and Data Vault 2.0 at Sber; distributed processing in the Gazprom Neft stack. AWS experience comes from a personal project.' },
  },
  {
    id: 'context', number: '04', label: 'CONTEXT', caption: 'ENTITIES / MEANING / TRUST',
    technologies: [
      { name: 'Data modeling', ru: 'Сущности, связи, логические и физические модели. В Сбере — концептуальная модель предметной области EdTech.', en: 'Entities, relationships, and logical and physical models. At Sber: a conceptual model for the EdTech domain.' },
      { name: 'Data Governance', ru: 'Жизненный цикл, качество, доступ и ответственность за данные. Опыт стратегии управления данными в Газпром нефти.', en: 'Data lifecycle, quality, access, and ownership, including a data governance strategy at Gazprom Neft.' },
      { name: 'MDM', ru: 'Согласованные справочники и мастер-данные. В опыте Shell — сопровождение и обновление MDM.', en: 'Consistent reference and master data, including MDM maintenance and updates at Shell.' },
      { name: 'Python', ru: 'Инженерный инструмент для работы с данными, автоматизации и интеграций. В стеке проектов Сбера и Газпром нефти.', en: 'An engineering tool for data work, automation, and integration, used in the Sber and Gazprom Neft project stacks.' },
    ],
    experience: ['sber', 'gazprom-neft', 'shell'],
    ru: { title: 'Смысл и контекст для AI', summary: 'Сущности, связи, качество и происхождение данных делают контекст понятным.', detail: 'AI нужен контекст с понятным смыслом: что означает сущность, как связаны факты и насколько данным можно доверять. Этот слой соединяет моделирование, управление данными и будущие AI-сценарии.', example: 'Концептуальная модель EdTech, подходы к жизненному циклу данных, Data Governance и MDM.' },
    en: { title: 'Meaning & context for AI', summary: 'Entities, relationships, quality, and provenance make context understandable.', detail: 'AI needs meaningful context: what an entity means, how facts connect, and how trustworthy the data is. This layer connects modelling and governance with future AI use cases.', example: 'An EdTech conceptual model, data lifecycle approaches, Data Governance, and MDM.' },
  },
  {
    id: 'ai', number: '05', label: 'INTELLIGENCE', caption: 'MODELS / MLOPS / INFERENCE',
    technologies: [
      { name: 'Kubeflow', ru: 'Среда для работы дата-сайентистов и ML-процессов. В Сбере — разработка data sandbox и MLOps-пайплайнов.', en: 'An environment for data scientists and ML workflows. At Sber: a data sandbox and MLOps pipelines.' },
      { name: 'KServe', ru: 'Развёртывание inference моделей. В Сбере — синхронное и асинхронное взаимодействие с on-premises моделями и SaaS.', en: 'Model inference serving. At Sber: synchronous and asynchronous interaction with on-premises models and SaaS.' },
      { name: 'MLflow', ru: 'Инструменты жизненного цикла ML-моделей и экспериментов. В технологическом стеке проектов Сбера.', en: 'Tools for the lifecycle of ML models and experiments, part of the Sber project stack.' },
      { name: 'Kubernetes', ru: 'Среда исполнения и развёртывания платформенных компонентов. В стеке Сбера и Газпром нефти.', en: 'A runtime and deployment environment for platform components, used at Sber and Gazprom Neft.' },
      { name: 'Docker', ru: 'Контейнеризация компонентов и воспроизводимая среда исполнения в инженерных проектах.', en: 'Containerised components and reproducible runtime environments for engineering projects.' },
    ],
    experience: ['sber'],
    ru: { title: 'AI и работающие модели', summary: 'Инфраструктура, в которой модели становятся доступными сервисами.', detail: 'От среды работы с моделями до их развёртывания и inference. Платформа связывает данные, ML-процессы и приложения, которым нужен результат.', example: 'Data sandbox на Kubeflow, MLOps-процессы и inference через KServe в Сбере.' },
    en: { title: 'AI & model serving', summary: 'Infrastructure that turns models into available services.', detail: 'From a working environment for models to deployment and inference. The platform connects data, ML workflows, and applications that need the result.', example: 'A Kubeflow data sandbox, MLOps workflows, and inference with KServe at Sber.' },
  },
] as const;
export type ArchitectureLayerId = typeof architectureLayers[number]['id'];
export const architectureCopy = {
  ru: {
    heading: 'От данных — к интеллекту.', instruction: 'Выберите слой — схема развернётся к вам.',
    scene: 'Интерактивная карта архитектуры данных и AI', caption: 'Данные обретают смысл.',
    open: 'Технологии и опыт', collapse: 'Свернуть описание', back: 'Вся архитектура', pause: 'Пауза', play: 'Запустить поток', static: 'Статичный режим',
    motion: 'Движение данных', inside: 'ВНУТРИ СЛОЯ', details: 'Технологии и мой опыт', case: 'В моём опыте',
    orchestration: 'Оркестрация процессов', foundation: 'Инженерная основа',
  },
  en: {
    heading: 'From data to intelligence.', instruction: 'Choose a layer to bring its diagram into focus.',
    scene: 'Interactive map of data and AI architecture', caption: 'Data becomes meaning.',
    open: 'Technologies & experience', collapse: 'Collapse description', back: 'Whole architecture', pause: 'Pause', play: 'Start the flow', static: 'Still mode',
    motion: 'Data movement', inside: 'INSIDE THE LAYER', details: 'Technologies and my experience', case: 'In my experience',
    orchestration: 'Workflow orchestration', foundation: 'Engineering foundation',
  },
} as const;
