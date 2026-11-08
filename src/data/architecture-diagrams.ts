import type { ArchitectureLayerId } from './architecture';

type Labels = { ru: readonly string[]; en: readonly string[] };
interface DiagramNode {
  id: string; x: number; y: number; width: number; height: number;
  labels: Labels; technologies: readonly string[]; personal: boolean;
}
interface DiagramEdge { from: string; to: string; path: string; }
interface Diagram {
  description: { ru: string; en: string };
  nodes: readonly DiagramNode[];
  edges: readonly DiagramEdge[];
}
const words = (ru: readonly string[], en: readonly string[] = ru): Labels => ({ ru, en });
const node = (id: string, box: [number, number, number, number], labels: Labels, technologies: readonly string[] = [], personal = false): DiagramNode => ({
  id, x: box[0], y: box[1], width: box[2], height: box[3], labels, technologies, personal,
});
const edge = (from: string, to: string, path: string): DiagramEdge => ({ from, to, path });

// Conceptual maps of the user's experience, rather than a single deployment.
// AWS is intentionally a separate personal-project node, without hosting edges.
export const architectureDiagrams: Record<ArchitectureLayerId, Diagram> = {
  sources: {
    description: {
      ru: 'Oracle, SQL Server, PostgreSQL, API и события передают записи и изменения.',
      en: 'Oracle, SQL Server, PostgreSQL, APIs, and events supply records and changes.',
    },
    nodes: [
      node('oracle', [18, 54, 102, 43], words(['Oracle']), ['Oracle']),
      node('sql-server', [129, 54, 102, 43], words(['SQL Server']), ['SQL Server']),
      node('postgres', [240, 54, 102, 43], words(['PostgreSQL']), ['PostgreSQL / PostGIS']),
      node('records', [111, 144, 138, 54], words(['Записи', 'и изменения'], ['Records', '& changes'])),
      node('api', [18, 221, 102, 38], words(['API'])),
      node('events', [240, 221, 102, 38], words(['События'], ['Events'])),
    ],
    edges: [
      edge('oracle', 'records', 'M69 97V117H145V144'),
      edge('sql-server', 'records', 'M180 97V144'),
      edge('postgres', 'records', 'M291 97V117H215V144'),
      edge('api', 'records', 'M120 240H145V198'),
      edge('events', 'records', 'M240 240H215V198'),
    ],
  },
  ingestion: {
    description: {
      ru: 'CDC в Kafka Connect получает изменения для Kafka; NiFi показывает отдельный путь интеграции.',
      en: 'CDC in Kafka Connect captures changes for Kafka; NiFi represents a separate integration path.',
    },
    nodes: [
      node('source', [18, 64, 91, 48], words(['Источник'], ['Source'])),
      node('capture', [127, 53, 109, 70], words(['CDC', 'Kafka Connect']), ['CDC', 'Kafka Connect']),
      node('kafka', [254, 64, 88, 48], words(['Kafka']), ['Kafka']),
      node('nifi', [127, 202, 109, 45], words(['NiFi']), ['NiFi']),
      node('consumers', [254, 202, 88, 45], words(['Системы'], ['Systems'])),
    ],
    edges: [
      edge('source', 'capture', 'M109 88H127'),
      edge('capture', 'kafka', 'M236 88H254'),
      edge('kafka', 'consumers', 'M298 112V202'),
      edge('source', 'nifi', 'M64 112V224H127'),
      edge('nifi', 'consumers', 'M236 224H254'),
    ],
  },
  platform: {
    description: {
      ru: 'Spark и SQL преобразуют данные для ClickHouse, Greenplum и моделей. AWS — отдельный личный проект.',
      en: 'Spark and SQL transform data for ClickHouse, Greenplum, and models. AWS is a separate personal project.',
    },
    nodes: [
      node('input', [18, 49, 98, 49], words(['Потоки', 'и загрузки'], ['Streams', '& loads'])),
      node('processing', [134, 49, 100, 49], words(['Spark', 'SQL']), ['Spark', 'SQL']),
      node('aws', [252, 45, 90, 57], words(['AWS', 'личный', 'проект'], ['AWS', 'personal', 'project']), ['AWS'], true),
      node('clickhouse', [36, 143, 125, 44], words(['ClickHouse']), ['ClickHouse']),
      node('greenplum', [199, 143, 125, 44], words(['Greenplum']), ['Greenplum']),
      node('models', [114, 221, 132, 38], words(['Модели данных'], ['Data models']), ['Data Vault 2.0']),
    ],
    edges: [
      edge('input', 'processing', 'M116 74H134'),
      edge('processing', 'clickhouse', 'M184 98V119H98V143'),
      edge('processing', 'greenplum', 'M184 119H261V143'),
      edge('clickhouse', 'models', 'M98 187V240H114'),
      edge('greenplum', 'models', 'M261 187V240H246'),
    ],
  },
  context: {
    description: {
      ru: 'Моделирование, governance, MDM и обработка на Python формируют смысл и контекст данных для AI.',
      en: 'Modelling, governance, MDM, and Python processing give data meaning and context for AI.',
    },
    nodes: [
      node('models', [18, 52, 136, 44], words(['Модели данных'], ['Data models']), ['Data modeling']),
      node('governance', [206, 52, 136, 44], words(['Governance']), ['Data Governance']),
      node('mdm', [18, 144, 94, 44], words(['MDM']), ['MDM']),
      node('meaning', [130, 132, 100, 64], words(['Смысл', 'и связи'], ['Meaning', '& relations'])),
      node('python', [248, 144, 94, 44], words(['Python']), ['Python']),
      node('context', [112, 223, 136, 36], words(['Контекст для AI'], ['AI context'])),
    ],
    edges: [
      edge('models', 'meaning', 'M86 96V112H160V132'),
      edge('governance', 'meaning', 'M274 96V112H200V132'),
      edge('mdm', 'meaning', 'M112 166H130'),
      edge('python', 'meaning', 'M248 166H230'),
      edge('meaning', 'context', 'M180 196V223'),
    ],
  },
  ai: {
    description: {
      ru: 'Работа с моделями в Kubeflow, жизненный цикл в MLflow и inference через KServe; среда Kubernetes и Docker.',
      en: 'Model workflows in Kubeflow, lifecycle in MLflow, and inference through KServe, with Kubernetes and Docker.',
    },
    nodes: [
      node('kubeflow', [18, 64, 98, 49], words(['Kubeflow']), ['Kubeflow']),
      node('mlflow', [132, 64, 96, 49], words(['MLflow']), ['MLflow']),
      node('kserve', [244, 64, 98, 49], words(['KServe']), ['KServe']),
      node('apps', [236, 167, 106, 44], words(['Приложения'], ['Applications'])),
      node('runtime', [18, 222, 204, 37], words(['Kubernetes · Docker']), ['Kubernetes', 'Docker']),
    ],
    edges: [
      edge('kubeflow', 'mlflow', 'M116 89H132'),
      edge('mlflow', 'kserve', 'M228 89H244'),
      edge('kserve', 'apps', 'M293 113V167'),
      edge('runtime', 'kubeflow', 'M67 222V113'),
      edge('runtime', 'kserve', 'M180 222V144H268V113'),
    ],
  },
};
