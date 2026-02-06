import type { Certification } from "./types";
import { v4 } from "./uuid";

// ===== UUID 생성 헬퍼 (시드 데이터용, 런타임에서는 DB에서 생성) =====
let _id = 0;
const uid = () => `cert-${String(++_id).padStart(4, "0")}`;

// ===== 초기 자격증 데이터 (xlsx + 이미지 기반 추출) =====

export const INITIAL_CERTIFICATIONS: Certification[] = [
  // =====================================================
  // Cloud - Amazon
  // =====================================================
  { id: uid(), tag: "Cloud", sub_tag: "Amazon", level: "Basic", name_ko: "AWS Cloud Practitioner (기초)", name_en: "AWS Cloud Practitioner",
    official_url: "https://aws.amazon.com/certification/certified-cloud-practitioner/" },
  { id: uid(), tag: "Cloud", sub_tag: "Amazon", level: "Intermediate", name_ko: "AWS Developer (Associate)", name_en: "AWS Developer Associate",
    official_url: "https://aws.amazon.com/certification/certified-developer-associate/" },
  { id: uid(), tag: "Cloud", sub_tag: "Amazon", level: "Intermediate", name_ko: "AWS Solution Architect (Associate)", name_en: "AWS SAA",
    official_url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" },
  { id: uid(), tag: "Cloud", sub_tag: "Amazon", level: "Intermediate", name_ko: "AWS SysOps Administrator (Associate)", name_en: "AWS SysOps",
    official_url: "https://aws.amazon.com/certification/certified-sysops-admin-associate/" },
  { id: uid(), tag: "Cloud", sub_tag: "Amazon", level: "Advanced", name_ko: "AWS Solution Architect (Professional)", name_en: "AWS SAP",
    official_url: "https://aws.amazon.com/certification/certified-solutions-architect-professional/" },
  { id: uid(), tag: "Cloud", sub_tag: "Amazon", level: "Advanced", name_ko: "AWS Security Specialty", name_en: "AWS Security",
    official_url: "https://aws.amazon.com/certification/certified-security-specialty/" },
  { id: uid(), tag: "Cloud", sub_tag: "Amazon", level: "Advanced", name_ko: "AWS Certified DevOps Engineer (Professional)", name_en: "AWS DevOps Pro",
    official_url: "https://aws.amazon.com/certification/certified-devops-engineer-professional/" },

  // =====================================================
  // Cloud - Google
  // =====================================================
  { id: uid(), tag: "Cloud", sub_tag: "Google", level: "Intermediate", name_ko: "Google TensorFlow Developer Certificate", name_en: "TensorFlow Dev",
    official_url: "https://www.tensorflow.org/certificate" },
  { id: uid(), tag: "Cloud", sub_tag: "Google", level: "Intermediate", name_ko: "Google Certificate for Machine Learning", name_en: "Google ML",
    official_url: "https://cloud.google.com/learn/certification/machine-learning-engineer" },
  { id: uid(), tag: "Cloud", sub_tag: "Google", level: "Intermediate", name_ko: "Google Certificate for Deep Learning", name_en: "Google DL",
    official_url: "https://cloud.google.com/learn/certification" },
  { id: uid(), tag: "Cloud", sub_tag: "Google", level: "Advanced", name_ko: "GCP Machine Learning Engineer (Professional)", name_en: "GCP ML Engineer",
    official_url: "https://cloud.google.com/learn/certification/machine-learning-engineer" },
  { id: uid(), tag: "Cloud", sub_tag: "Google", level: "Advanced", name_ko: "GCP Data Engineer (Professional)", name_en: "GCP Data Engineer",
    official_url: "https://cloud.google.com/learn/certification/data-engineer" },
  { id: uid(), tag: "Cloud", sub_tag: "Google", level: "Advanced", name_ko: "GCP Cloud Security Engineer (Professional)", name_en: "GCP Security",
    official_url: "https://cloud.google.com/learn/certification/cloud-security-engineer" },
  { id: uid(), tag: "Cloud", sub_tag: "Google", level: "Advanced", name_ko: "GCP Cloud Developer (Professional)", name_en: "GCP Developer",
    official_url: "https://cloud.google.com/learn/certification/cloud-developer" },
  { id: uid(), tag: "Cloud", sub_tag: "Google", level: "Advanced", name_ko: "GCP Cloud Architect (Professional)", name_en: "GCP Architect",
    official_url: "https://cloud.google.com/learn/certification/cloud-architect" },

  // =====================================================
  // Cloud - MS
  // =====================================================
  { id: uid(), tag: "Cloud", sub_tag: "MS", level: "Basic", name_ko: "MS Azure Fundamentals (초급)", name_en: "AZ-900",
    official_url: "https://learn.microsoft.com/ko-kr/credentials/certifications/azure-fundamentals/" },
  { id: uid(), tag: "Cloud", sub_tag: "MS", level: "Intermediate", name_ko: "MS Azure Security Engineer Associate", name_en: "AZ-500",
    official_url: "https://learn.microsoft.com/ko-kr/credentials/certifications/azure-security-engineer/" },
  { id: uid(), tag: "Cloud", sub_tag: "MS", level: "Intermediate", name_ko: "MS Azure Developer Associate", name_en: "AZ-204",
    official_url: "https://learn.microsoft.com/ko-kr/credentials/certifications/azure-developer/" },
  { id: uid(), tag: "Cloud", sub_tag: "MS", level: "Intermediate", name_ko: "MS Azure Data Scientist Associate", name_en: "DP-100",
    official_url: "https://learn.microsoft.com/ko-kr/credentials/certifications/azure-data-scientist/" },
  { id: uid(), tag: "Cloud", sub_tag: "MS", level: "Intermediate", name_ko: "MS Azure Data Engineer Associate", name_en: "DP-203",
    official_url: "https://learn.microsoft.com/ko-kr/credentials/certifications/azure-data-engineer/" },
  { id: uid(), tag: "Cloud", sub_tag: "MS", level: "Advanced", name_ko: "MS Azure Solutions Architect Expert", name_en: "AZ-305",
    official_url: "https://learn.microsoft.com/ko-kr/credentials/certifications/azure-solutions-architect/" },
  { id: uid(), tag: "Cloud", sub_tag: "MS", level: "Advanced", name_ko: "MS Azure DevOps Engineer Expert", name_en: "AZ-400",
    official_url: "https://learn.microsoft.com/ko-kr/credentials/certifications/devops-engineer/" },

  // =====================================================
  // Cloud - Oracle
  // =====================================================
  { id: uid(), tag: "Cloud", sub_tag: "Oracle", level: "Basic", name_ko: "OCI Foundations Associate", name_en: "OCI Foundations",
    official_url: "https://education.oracle.com/oracle-cloud-infrastructure-foundations-associate/pexam_1Z0-1085-24" },

  // =====================================================
  // Cloud - CNCF
  // =====================================================
  { id: uid(), tag: "Cloud", sub_tag: "CNCF", level: "Basic", name_ko: "CKAD", name_en: "CKAD",
    official_url: "https://www.cncf.io/certification/ckad/" },
  { id: uid(), tag: "Cloud", sub_tag: "CNCF", level: "Intermediate", name_ko: "CKA", name_en: "CKA",
    official_url: "https://www.cncf.io/certification/cka/" },
  { id: uid(), tag: "Cloud", sub_tag: "CNCF", level: "Advanced", name_ko: "CKS (CKS Professional)", name_en: "CKS",
    official_url: "https://www.cncf.io/certification/cks/" },

  // =====================================================
  // 네트워크
  // =====================================================
  { id: uid(), tag: "네트워크", sub_tag: "", level: "Basic", name_ko: "네트워크관리사 2급", name_en: "Network Admin Level 2",
    official_url: "https://www.icqa.or.kr/cn/page/network" },
  { id: uid(), tag: "네트워크", sub_tag: "", level: "Basic", name_ko: "정보통신운용기능사", name_en: "Telecom Operator",
    official_url: "https://www.q-net.or.kr/crf005.do?id=crf00503s02" },
  { id: uid(), tag: "네트워크", sub_tag: "", level: "Intermediate", name_ko: "Cisco Certified Network Associate (CCNA)", name_en: "CCNA",
    official_url: "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/enterprise/ccna/index.html" },
  { id: uid(), tag: "네트워크", sub_tag: "", level: "Intermediate", name_ko: "정보통신기사", name_en: "Telecom Engineer",
    official_url: "https://www.q-net.or.kr/crf005.do?id=crf00503s02" },
  { id: uid(), tag: "네트워크", sub_tag: "", level: "Advanced", name_ko: "Cisco Certified Network Professional (CCNP)", name_en: "CCNP",
    official_url: "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/enterprise/ccnp-enterprise/index.html" },
  { id: uid(), tag: "네트워크", sub_tag: "", level: "Master", name_ko: "Cisco Certified Internetwork Expert (CCIE)", name_en: "CCIE",
    official_url: "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/enterprise/ccie-enterprise-infrastructure/index.html" },
  { id: uid(), tag: "네트워크", sub_tag: "", level: "Master", name_ko: "컴퓨터시스템응용기술사", name_en: "Computer System Tech",
    official_url: "https://www.q-net.or.kr/crf005.do?id=crf00503s02" },
  { id: uid(), tag: "네트워크", sub_tag: "", level: "Master", name_ko: "정보통신기술사", name_en: "Telecom Master",
    official_url: "https://www.q-net.or.kr/crf005.do?id=crf00503s02" },

  // =====================================================
  // 데이터
  // =====================================================
  { id: uid(), tag: "데이터", sub_tag: "", level: "Basic", name_ko: "SQLD (SQL개발자)", name_en: "SQLD",
    official_url: "https://www.dataq.or.kr/www/sub/a_04.do" },
  { id: uid(), tag: "데이터", sub_tag: "", level: "Basic", name_ko: "ADsP (데이터분석 준전문가)", name_en: "ADsP",
    official_url: "https://www.dataq.or.kr/www/sub/a_04.do" },
  { id: uid(), tag: "데이터", sub_tag: "", level: "Basic", name_ko: "비즈니스데이터분석사", name_en: "Business Data Analyst",
    official_url: "https://license.korcham.net/" },
  { id: uid(), tag: "데이터", sub_tag: "", level: "Basic", name_ko: "사회조사분석사", name_en: "Social Survey Analyst",
    official_url: "https://www.q-net.or.kr/crf005.do?id=crf00503s02" },
  { id: uid(), tag: "데이터", sub_tag: "", level: "Basic", name_ko: "CCA (Cloudera)", name_en: "CCA",
    official_url: "https://www.cloudera.com/about/training/certification.html" },
  { id: uid(), tag: "데이터", sub_tag: "", level: "Intermediate", name_ko: "빅데이터분석기사", name_en: "Big Data Analyst",
    official_url: "https://www.q-net.or.kr/crf005.do?id=crf00503s02" },
  { id: uid(), tag: "데이터", sub_tag: "", level: "Advanced", name_ko: "ADP (데이터분석 전문가)", name_en: "ADP",
    official_url: "https://www.dataq.or.kr/www/sub/a_04.do" },
  { id: uid(), tag: "데이터", sub_tag: "", level: "Advanced", name_ko: "CCP (Cloudera Certified Professional)", name_en: "CCP",
    official_url: "https://www.cloudera.com/about/training/certification.html" },
  { id: uid(), tag: "데이터", sub_tag: "", level: "Advanced", name_ko: "SQLP (SQL전문가)", name_en: "SQLP",
    official_url: "https://www.dataq.or.kr/www/sub/a_04.do" },

  // =====================================================
  // 서버/DB - Java
  // =====================================================
  { id: uid(), tag: "서버/DB", sub_tag: "Java", level: "Basic", name_ko: "OCAJP (Oracle Certified Assoc Java SE 8)", name_en: "OCAJP",
    official_url: "https://education.oracle.com/java-and-dev-frameworks/java-se/product_702" },
  { id: uid(), tag: "서버/DB", sub_tag: "Java", level: "Intermediate", name_ko: "OCPJP (Oracle Certified Prof Java SE 8)", name_en: "OCPJP",
    official_url: "https://education.oracle.com/java-and-dev-frameworks/java-se/product_702" },
  { id: uid(), tag: "서버/DB", sub_tag: "Java", level: "Intermediate", name_ko: "OCJP", name_en: "OCJP",
    official_url: "https://education.oracle.com/java-and-dev-frameworks/java-se/product_702" },
  { id: uid(), tag: "서버/DB", sub_tag: "Java", level: "Advanced", name_ko: "OCWCD (Oracle Certified Web Component Developer)", name_en: "OCWCD",
    official_url: "https://education.oracle.com/java-and-dev-frameworks/java-ee-and-web-services/product_702" },
  { id: uid(), tag: "서버/DB", sub_tag: "Java", level: "Master", name_ko: "OCBCD (Oracle Certified Business Component Developer)", name_en: "OCBCD",
    official_url: "https://education.oracle.com/java-and-dev-frameworks/java-ee-and-web-services/product_702" },

  // =====================================================
  // 서버/DB - Linux
  // =====================================================
  { id: uid(), tag: "서버/DB", sub_tag: "Linux", level: "Basic", name_ko: "정보처리산업기사", name_en: "Info Processing Industrial",
    official_url: "https://www.q-net.or.kr/crf005.do?id=crf00503s02" },
  { id: uid(), tag: "서버/DB", sub_tag: "Linux", level: "Basic", name_ko: "리눅스마스터 2급", name_en: "Linux Master 2",
    official_url: "https://www.ihd.or.kr/introducesubject1.do" },
  { id: uid(), tag: "서버/DB", sub_tag: "Linux", level: "Basic", name_ko: "LPIC Level 1", name_en: "LPIC-1",
    official_url: "https://www.lpi.org/our-certifications/lpic-1-overview" },
  { id: uid(), tag: "서버/DB", sub_tag: "Linux", level: "Intermediate", name_ko: "정보처리기사", name_en: "Info Processing Engineer",
    official_url: "https://www.q-net.or.kr/crf005.do?id=crf00503s02" },
  { id: uid(), tag: "서버/DB", sub_tag: "Linux", level: "Intermediate", name_ko: "LPIC Level 2", name_en: "LPIC-2",
    official_url: "https://www.lpi.org/our-certifications/lpic-2-overview" },
  { id: uid(), tag: "서버/DB", sub_tag: "Linux", level: "Intermediate", name_ko: "RHCSA (Red Hat)", name_en: "RHCSA",
    official_url: "https://www.redhat.com/en/services/certification/rhcsa" },
  { id: uid(), tag: "서버/DB", sub_tag: "Linux", level: "Advanced", name_ko: "RHCE (Red Hat Certified Engineer)", name_en: "RHCE",
    official_url: "https://www.redhat.com/en/services/certification/rhce" },
  { id: uid(), tag: "서버/DB", sub_tag: "Linux", level: "Advanced", name_ko: "리눅스마스터 1급", name_en: "Linux Master 1",
    official_url: "https://www.ihd.or.kr/introducesubject1.do" },
  { id: uid(), tag: "서버/DB", sub_tag: "Linux", level: "Advanced", name_ko: "LPIC Level 3", name_en: "LPIC-3",
    official_url: "https://www.lpi.org/our-certifications/lpic-3-overview" },
  { id: uid(), tag: "서버/DB", sub_tag: "Linux", level: "Master", name_ko: "정보관리기술사", name_en: "Info Management Tech",
    official_url: "https://www.q-net.or.kr/crf005.do?id=crf00503s02" },
  { id: uid(), tag: "서버/DB", sub_tag: "Linux", level: "Master", name_ko: "RHCA (Red Hat Certified Architect)", name_en: "RHCA",
    official_url: "https://www.redhat.com/en/services/certification/rhca" },

  // =====================================================
  // 서버/DB - SQL
  // =====================================================
  { id: uid(), tag: "서버/DB", sub_tag: "SQL", level: "Basic", name_ko: "OCA (Oracle Certified Associate)", name_en: "OCA",
    official_url: "https://education.oracle.com/oracle-database/oracle-database-administration/product_702" },
  { id: uid(), tag: "서버/DB", sub_tag: "SQL", level: "Intermediate", name_ko: "OCP (Oracle Certified Professional)", name_en: "OCP",
    official_url: "https://education.oracle.com/oracle-database/oracle-database-administration/product_702" },
  { id: uid(), tag: "서버/DB", sub_tag: "SQL", level: "Master", name_ko: "OCM (Oracle Certified Master)", name_en: "OCM",
    official_url: "https://education.oracle.com/oracle-database/oracle-database-administration/product_702" },

  // =====================================================
  // 아키텍처
  // =====================================================
  { id: uid(), tag: "아키텍처", sub_tag: "", level: "Basic", name_ko: "DAsP (데이터아키텍처 준전문가)", name_en: "DAsP",
    official_url: "https://www.dataq.or.kr/www/sub/a_04.do" },
  { id: uid(), tag: "아키텍처", sub_tag: "", level: "Advanced", name_ko: "DAP (데이터아키텍처 전문가)", name_en: "DAP",
    official_url: "https://www.dataq.or.kr/www/sub/a_04.do" },

  // =====================================================
  // 보안 - 개인정보
  // =====================================================
  { id: uid(), tag: "보안", sub_tag: "개인정보", level: "Basic", name_ko: "마이데이터관리사", name_en: "MyData Manager",
    official_url: "https://www.mydatakorea.org/" },
  { id: uid(), tag: "보안", sub_tag: "개인정보", level: "Basic", name_ko: "PIP (개인정보보호사)", name_en: "PIP",
    official_url: "https://www.pipc.go.kr/" },
  { id: uid(), tag: "보안", sub_tag: "개인정보", level: "Intermediate", name_ko: "CPPG (개인정보관리사)", name_en: "CPPG",
    official_url: "https://www.opa.or.kr/" },
  { id: uid(), tag: "보안", sub_tag: "개인정보", level: "Intermediate", name_ko: "ISO 19011 인증심사원", name_en: "ISO 19011 Auditor",
    official_url: "https://www.kab.or.kr/" },
  { id: uid(), tag: "보안", sub_tag: "개인정보", level: "Intermediate", name_ko: "ISO 27701 (심사원보/심사원)", name_en: "ISO 27701",
    official_url: "https://www.kab.or.kr/" },
  { id: uid(), tag: "보안", sub_tag: "개인정보", level: "Advanced", name_ko: "PIA (개인정보영향평가사)", name_en: "PIA",
    official_url: "https://www.kisa.or.kr/" },
  { id: uid(), tag: "보안", sub_tag: "개인정보", level: "Advanced", name_ko: "ISO 27001 인증심사원", name_en: "ISO 27001 Auditor",
    official_url: "https://www.kab.or.kr/" },
  { id: uid(), tag: "보안", sub_tag: "개인정보", level: "Master", name_ko: "ISMS-P (심사원보/심사원/선임심사원)", name_en: "ISMS-P",
    official_url: "https://isms.kisa.or.kr/" },

  // =====================================================
  // 보안 - 정보보안
  // =====================================================
  { id: uid(), tag: "보안", sub_tag: "정보보안", level: "Basic", name_ko: "정보보안산업기사", name_en: "Info Security Industrial",
    official_url: "https://www.q-net.or.kr/crf005.do?id=crf00503s02" },
  { id: uid(), tag: "보안", sub_tag: "정보보안", level: "Intermediate", name_ko: "CFSE (금융보안관리사)", name_en: "CFSE",
    official_url: "https://www.kbi.or.kr/" },
  { id: uid(), tag: "보안", sub_tag: "정보보안", level: "Intermediate", name_ko: "정보보안기사", name_en: "Info Security Engineer",
    official_url: "https://www.q-net.or.kr/crf005.do?id=crf00503s02" },
  { id: uid(), tag: "보안", sub_tag: "정보보안", level: "Intermediate", name_ko: "SSCP", name_en: "SSCP",
    official_url: "https://www.isc2.org/certifications/sscp" },
  { id: uid(), tag: "보안", sub_tag: "정보보안", level: "Advanced", name_ko: "CCSP", name_en: "CCSP",
    official_url: "https://www.isc2.org/certifications/ccsp" },
  { id: uid(), tag: "보안", sub_tag: "정보보안", level: "Advanced", name_ko: "CISSP (공인정보시스템 보안전문가)", name_en: "CISSP",
    official_url: "https://www.isc2.org/certifications/cissp" },
  { id: uid(), tag: "보안", sub_tag: "정보보안", level: "Advanced", name_ko: "CISA (공인정보시스템 감사자)", name_en: "CISA",
    official_url: "https://www.isaca.org/credentialing/cisa" },
  { id: uid(), tag: "보안", sub_tag: "정보보안", level: "Master", name_ko: "정보시스템감리사", name_en: "IS Auditor",
    official_url: "https://www.sp.or.kr/" },

  // =====================================================
  // AI
  // =====================================================
  { id: uid(), tag: "AI", sub_tag: "", level: "Basic", name_ko: "AIFB Basic", name_en: "AIFB Basic",
    official_url: "https://www.kaia.or.kr/" },
  { id: uid(), tag: "AI", sub_tag: "", level: "Basic", name_ko: "AICE Basic", name_en: "AICE Basic",
    official_url: "https://aice.study/" },
  { id: uid(), tag: "AI", sub_tag: "", level: "Intermediate", name_ko: "AICE Associate", name_en: "AICE Associate",
    official_url: "https://aice.study/" },

  // =====================================================
  // Project Managing
  // =====================================================
  { id: uid(), tag: "Project Managing", sub_tag: "", level: "Basic", name_ko: "CSM", name_en: "CSM",
    official_url: "https://www.scrumalliance.org/get-certified/scrum-master-track/certified-scrummaster" },
  { id: uid(), tag: "Project Managing", sub_tag: "", level: "Basic", name_ko: "CAPM", name_en: "CAPM",
    official_url: "https://www.pmi.org/certifications/certified-associate-capm" },
  { id: uid(), tag: "Project Managing", sub_tag: "", level: "Intermediate", name_ko: "APM", name_en: "APM",
    official_url: "https://www.apm.org.uk/qualifications-and-training/" },
  { id: uid(), tag: "Project Managing", sub_tag: "", level: "Intermediate", name_ko: "CPMP", name_en: "CPMP",
    official_url: "https://www.ipma.world/individuals/certification/" },
  { id: uid(), tag: "Project Managing", sub_tag: "", level: "Intermediate", name_ko: "PPM", name_en: "PPM",
    official_url: "https://www.ipma.world/individuals/certification/" },
  { id: uid(), tag: "Project Managing", sub_tag: "", level: "Advanced", name_ko: "CPD", name_en: "CPD",
    official_url: "https://www.ipma.world/individuals/certification/" },
  { id: uid(), tag: "Project Managing", sub_tag: "", level: "Advanced", name_ko: "Prince2 Practitioner", name_en: "Prince2",
    official_url: "https://www.axelos.com/certifications/prince2" },
  { id: uid(), tag: "Project Managing", sub_tag: "", level: "Master", name_ko: "PMP", name_en: "PMP",
    official_url: "https://www.pmi.org/certifications/project-management-pmp" },

  // =====================================================
  // QA
  // =====================================================
  { id: uid(), tag: "QA", sub_tag: "", level: "Basic", name_ko: "CSTS Foundation Level", name_en: "CSTS Foundation",
    official_url: "https://www.kstqb.org/" },
  { id: uid(), tag: "QA", sub_tag: "", level: "Basic", name_ko: "ISTQB", name_en: "ISTQB",
    official_url: "https://www.kstqb.org/" },
  { id: uid(), tag: "QA", sub_tag: "", level: "Basic", name_ko: "Six Sigma Green Belt", name_en: "Six Sigma GB",
    official_url: "https://www.asq.org/cert/six-sigma-green-belt" },
  { id: uid(), tag: "QA", sub_tag: "", level: "Advanced", name_ko: "CSTS Advanced Level", name_en: "CSTS Advanced",
    official_url: "https://www.kstqb.org/" },

  // =====================================================
  // Infra
  // =====================================================
  { id: uid(), tag: "Infra", sub_tag: "", level: "Basic", name_ko: "ITIL Foundation", name_en: "ITIL Foundation",
    official_url: "https://www.axelos.com/certifications/itil-service-management" },
  { id: uid(), tag: "Infra", sub_tag: "", level: "Basic", name_ko: "정보기기운용기능사", name_en: "IT Equipment Operator",
    official_url: "https://www.q-net.or.kr/crf005.do?id=crf00503s02" },
  { id: uid(), tag: "Infra", sub_tag: "", level: "Basic", name_ko: "Certified Data Center Professional", name_en: "CDCP",
    official_url: "https://www.exin.com/" },
  { id: uid(), tag: "Infra", sub_tag: "", level: "Intermediate", name_ko: "Certified Data Center Specialist", name_en: "CDCS",
    official_url: "https://www.exin.com/" },
  { id: uid(), tag: "Infra", sub_tag: "", level: "Advanced", name_ko: "Certified Data Center Expert", name_en: "CDCE",
    official_url: "https://www.exin.com/" },

  // =====================================================
  // UX/UI
  // =====================================================
  { id: uid(), tag: "UX/UI", sub_tag: "", level: "Basic", name_ko: "컴퓨터그래픽스운용기능사", name_en: "CG Operator",
    official_url: "https://www.q-net.or.kr/crf005.do?id=crf00503s02" },
  { id: uid(), tag: "UX/UI", sub_tag: "", level: "Basic", name_ko: "Google UX Design Certificate", name_en: "Google UX",
    official_url: "https://grow.google/certificates/ux-design/" },
  { id: uid(), tag: "UX/UI", sub_tag: "", level: "Intermediate", name_ko: "서비스경험디자인기사", name_en: "Service Design Engineer",
    official_url: "https://www.q-net.or.kr/crf005.do?id=crf00503s02" },
  { id: uid(), tag: "UX/UI", sub_tag: "", level: "Intermediate", name_ko: "컬러리스트기사", name_en: "Colorist Engineer",
    official_url: "https://www.q-net.or.kr/crf005.do?id=crf00503s02" },

  // =====================================================
  // 감사
  // =====================================================
  { id: uid(), tag: "감사", sub_tag: "", level: "Master", name_ko: "CIA", name_en: "CIA",
    official_url: "https://www.theiia.org/en/certifications/cia/" },

  // =====================================================
  // Solution - SAP
  // =====================================================
  { id: uid(), tag: "Solution", sub_tag: "SAP", level: "Intermediate", name_ko: "SAP Basic", name_en: "SAP Basic",
    official_url: "https://training.sap.com/certification/" },
  { id: uid(), tag: "Solution", sub_tag: "SAP", level: "Advanced", name_ko: "SAP Professional Certification", name_en: "SAP Pro",
    official_url: "https://training.sap.com/certification/" },

  // =====================================================
  // Solution - SAS
  // =====================================================
  { id: uid(), tag: "Solution", sub_tag: "SAS", level: "Basic", name_ko: "SAS Certified Base Programmer", name_en: "SAS Base",
    official_url: "https://www.sas.com/en_us/certification.html" },
  { id: uid(), tag: "Solution", sub_tag: "SAS", level: "Intermediate", name_ko: "SAS SCSBA", name_en: "SAS SCSBA",
    official_url: "https://www.sas.com/en_us/certification.html" },

  // =====================================================
  // 금융/기타
  // =====================================================
  { id: uid(), tag: "금융/기타", sub_tag: "", level: "Basic", name_ko: "KBI 금융 DT", name_en: "KBI Finance DT",
    official_url: "https://www.kbi.or.kr/" },
  { id: uid(), tag: "금융/기타", sub_tag: "", level: "Basic", name_ko: "외환전문역 1종", name_en: "Forex Expert 1",
    official_url: "https://www.kbi.or.kr/" },
  { id: uid(), tag: "금융/기타", sub_tag: "", level: "Basic", name_ko: "증권투자권유자문인력", name_en: "Securities Advisory",
    official_url: "https://license.kofia.or.kr/" },
  { id: uid(), tag: "금융/기타", sub_tag: "", level: "Basic", name_ko: "펀드투자권유자문인력", name_en: "Fund Advisory",
    official_url: "https://license.kofia.or.kr/" },
  { id: uid(), tag: "금융/기타", sub_tag: "", level: "Basic", name_ko: "컴퓨터활용능력 1급", name_en: "Computer Skills 1",
    official_url: "https://license.korcham.net/" },
  { id: uid(), tag: "금융/기타", sub_tag: "", level: "Basic", name_ko: "보험대리점 / 변액보험", name_en: "Insurance Agent",
    official_url: "https://www.klia.or.kr/" },
  { id: uid(), tag: "금융/기타", sub_tag: "", level: "Basic", name_ko: "전산회계 1급", name_en: "Computer Accounting 1",
    official_url: "https://license.kacpta.or.kr/" },
  { id: uid(), tag: "금융/기타", sub_tag: "", level: "Basic", name_ko: "영업점 컴플라이언스 오피서(은행)", name_en: "Compliance Officer",
    official_url: "https://www.kbi.or.kr/" },
  { id: uid(), tag: "금융/기타", sub_tag: "", level: "Intermediate", name_ko: "외환전문역 2종", name_en: "Forex Expert 2",
    official_url: "https://www.kbi.or.kr/" },
  { id: uid(), tag: "금융/기타", sub_tag: "", level: "Intermediate", name_ko: "AFPK", name_en: "AFPK",
    official_url: "https://www.fpkorea.com/" },
  { id: uid(), tag: "금융/기타", sub_tag: "", level: "Intermediate", name_ko: "파생상품투자권유자문인력", name_en: "Derivatives Advisory",
    official_url: "https://license.kofia.or.kr/" },
  { id: uid(), tag: "금융/기타", sub_tag: "", level: "Intermediate", name_ko: "투자자산운용사", name_en: "Investment Manager",
    official_url: "https://license.kofia.or.kr/" },
  { id: uid(), tag: "금융/기타", sub_tag: "", level: "Intermediate", name_ko: "CAMS", name_en: "CAMS",
    official_url: "https://www.acams.org/en/certifications/certified-anti-money-laundering-specialist" },
  { id: uid(), tag: "금융/기타", sub_tag: "", level: "Intermediate", name_ko: "CGSS", name_en: "CGSS",
    official_url: "https://www.acams.org/en/certifications/certified-global-sanctions-specialist" },
  { id: uid(), tag: "금융/기타", sub_tag: "", level: "Intermediate", name_ko: "여신심사역 / 신용분석사", name_en: "Credit Analyst",
    official_url: "https://www.kbi.or.kr/" },
  { id: uid(), tag: "금융/기타", sub_tag: "", level: "Advanced", name_ko: "CFP", name_en: "CFP",
    official_url: "https://www.fpkorea.com/" },
  { id: uid(), tag: "금융/기타", sub_tag: "", level: "Advanced", name_ko: "신용위험분석사", name_en: "Credit Risk Analyst",
    official_url: "https://www.kbi.or.kr/" },
  { id: uid(), tag: "금융/기타", sub_tag: "", level: "Advanced", name_ko: "재무위험관리사 (국내FRM)", name_en: "FRM Domestic",
    official_url: "https://license.kofia.or.kr/" },
  { id: uid(), tag: "금융/기타", sub_tag: "", level: "Master", name_ko: "재무위험관리사 (국제 FRM)", name_en: "FRM International",
    official_url: "https://www.garp.org/frm" },
];
