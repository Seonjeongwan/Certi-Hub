-- =====================================================
-- Certi-Hub 시드 데이터
-- guide.md Phase 1: 제공된 이미지/엑셀 데이터 기반 초기 DB 마이그레이션
-- =====================================================

-- ===== Cloud - Amazon =====
INSERT INTO certifications (name_ko, name_en, tag, sub_tag, level) VALUES
('AWS Cloud Practitioner (기초)', 'AWS Cloud Practitioner', 'Cloud', 'Amazon', 'Basic'),
('AWS Developer (Associate)', 'AWS Developer Associate', 'Cloud', 'Amazon', 'Intermediate'),
('AWS Solution Architect (Associate)', 'AWS SAA', 'Cloud', 'Amazon', 'Intermediate'),
('AWS SysOps Administrator (Associate)', 'AWS SysOps', 'Cloud', 'Amazon', 'Intermediate'),
('AWS Solution Architect (Professional)', 'AWS SAP', 'Cloud', 'Amazon', 'Advanced'),
('AWS Security Specialty', 'AWS Security', 'Cloud', 'Amazon', 'Advanced'),
('AWS Certified DevOps Engineer (Professional)', 'AWS DevOps Pro', 'Cloud', 'Amazon', 'Advanced');

-- ===== Cloud - Google =====
INSERT INTO certifications (name_ko, name_en, tag, sub_tag, level) VALUES
('Google TensorFlow Developer Certificate', 'TensorFlow Dev', 'Cloud', 'Google', 'Intermediate'),
('Google Certificate for Machine Learning', 'Google ML', 'Cloud', 'Google', 'Intermediate'),
('Google Certificate for Deep Learning', 'Google DL', 'Cloud', 'Google', 'Intermediate'),
('GCP Machine Learning Engineer (Professional)', 'GCP ML Engineer', 'Cloud', 'Google', 'Advanced'),
('GCP Data Engineer (Professional)', 'GCP Data Engineer', 'Cloud', 'Google', 'Advanced'),
('GCP Cloud Security Engineer (Professional)', 'GCP Security', 'Cloud', 'Google', 'Advanced'),
('GCP Cloud Developer (Professional)', 'GCP Developer', 'Cloud', 'Google', 'Advanced'),
('GCP Cloud Architect (Professional)', 'GCP Architect', 'Cloud', 'Google', 'Advanced');

-- ===== Cloud - MS =====
INSERT INTO certifications (name_ko, name_en, tag, sub_tag, level) VALUES
('MS Azure Fundamentals (초급)', 'AZ-900', 'Cloud', 'MS', 'Basic'),
('MS Azure Security Engineer Associate', 'AZ-500', 'Cloud', 'MS', 'Intermediate'),
('MS Azure Developer Associate', 'AZ-204', 'Cloud', 'MS', 'Intermediate'),
('MS Azure Data Scientist Associate', 'DP-100', 'Cloud', 'MS', 'Intermediate'),
('MS Azure Data Engineer Associate', 'DP-203', 'Cloud', 'MS', 'Intermediate'),
('MS Azure Solutions Architect Expert', 'AZ-305', 'Cloud', 'MS', 'Advanced'),
('MS Azure DevOps Engineer Expert', 'AZ-400', 'Cloud', 'MS', 'Advanced');

-- ===== Cloud - Oracle / CNCF =====
INSERT INTO certifications (name_ko, name_en, tag, sub_tag, level) VALUES
('OCI Foundations Associate', 'OCI Foundations', 'Cloud', 'Oracle', 'Basic'),
('CKAD', 'CKAD', 'Cloud', 'CNCF', 'Basic'),
('CKA', 'CKA', 'Cloud', 'CNCF', 'Intermediate'),
('CKS (CKS Professional)', 'CKS', 'Cloud', 'CNCF', 'Advanced');

-- ===== 네트워크 =====
INSERT INTO certifications (name_ko, name_en, tag, sub_tag, level) VALUES
('네트워크관리사 2급', 'Network Admin Level 2', '네트워크', '', 'Basic'),
('정보통신운용기능사', 'Telecom Operator', '네트워크', '', 'Basic'),
('Cisco Certified Network Associate (CCNA)', 'CCNA', '네트워크', '', 'Intermediate'),
('정보통신기사', 'Telecom Engineer', '네트워크', '', 'Intermediate'),
('Cisco Certified Network Professional (CCNP)', 'CCNP', '네트워크', '', 'Advanced'),
('Cisco Certified Internetwork Expert (CCIE)', 'CCIE', '네트워크', '', 'Master'),
('컴퓨터시스템응용기술사', 'Computer System Tech', '네트워크', '', 'Master'),
('정보통신기술사', 'Telecom Master', '네트워크', '', 'Master');

-- ===== 데이터 =====
INSERT INTO certifications (name_ko, name_en, tag, sub_tag, level) VALUES
('SQLD (SQL개발자)', 'SQLD', '데이터', '', 'Basic'),
('ADsP (데이터분석 준전문가)', 'ADsP', '데이터', '', 'Basic'),
('비즈니스데이터분석사', 'Business Data Analyst', '데이터', '', 'Basic'),
('사회조사분석사', 'Social Survey Analyst', '데이터', '', 'Basic'),
('CCA (Cloudera)', 'CCA', '데이터', '', 'Basic'),
('빅데이터분석기사', 'Big Data Analyst', '데이터', '', 'Intermediate'),
('ADP (데이터분석 전문가)', 'ADP', '데이터', '', 'Advanced'),
('CCP (Cloudera Certified Professional)', 'CCP', '데이터', '', 'Advanced'),
('SQLP (SQL전문가)', 'SQLP', '데이터', '', 'Advanced');

-- ===== 서버/DB =====
INSERT INTO certifications (name_ko, name_en, tag, sub_tag, level) VALUES
('OCAJP (Oracle Certified Assoc Java SE 8)', 'OCAJP', '서버/DB', 'Java', 'Basic'),
('OCPJP (Oracle Certified Prof Java SE 8)', 'OCPJP', '서버/DB', 'Java', 'Intermediate'),
('OCJP', 'OCJP', '서버/DB', 'Java', 'Intermediate'),
('OCWCD (Oracle Certified Web Component Developer)', 'OCWCD', '서버/DB', 'Java', 'Advanced'),
('OCBCD (Oracle Certified Business Component Developer)', 'OCBCD', '서버/DB', 'Java', 'Master'),
('정보처리산업기사', 'Info Processing Industrial', '서버/DB', 'Linux', 'Basic'),
('리눅스마스터 2급', 'Linux Master 2', '서버/DB', 'Linux', 'Basic'),
('LPIC Level 1', 'LPIC-1', '서버/DB', 'Linux', 'Basic'),
('정보처리기사', 'Info Processing Engineer', '서버/DB', 'Linux', 'Intermediate'),
('LPIC Level 2', 'LPIC-2', '서버/DB', 'Linux', 'Intermediate'),
('RHCSA (Red Hat)', 'RHCSA', '서버/DB', 'Linux', 'Intermediate'),
('RHCE (Red Hat Certified Engineer)', 'RHCE', '서버/DB', 'Linux', 'Advanced'),
('리눅스마스터 1급', 'Linux Master 1', '서버/DB', 'Linux', 'Advanced'),
('LPIC Level 3', 'LPIC-3', '서버/DB', 'Linux', 'Advanced'),
('정보관리기술사', 'Info Management Tech', '서버/DB', 'Linux', 'Master'),
('RHCA (Red Hat Certified Architect)', 'RHCA', '서버/DB', 'Linux', 'Master'),
('OCA (Oracle Certified Associate)', 'OCA', '서버/DB', 'SQL', 'Basic'),
('OCP (Oracle Certified Professional)', 'OCP', '서버/DB', 'SQL', 'Intermediate'),
('OCM (Oracle Certified Master)', 'OCM', '서버/DB', 'SQL', 'Master');

-- ===== 아키텍처 =====
INSERT INTO certifications (name_ko, name_en, tag, sub_tag, level) VALUES
('DAsP (데이터아키텍처 준전문가)', 'DAsP', '아키텍처', '', 'Basic'),
('DAP (데이터아키텍처 전문가)', 'DAP', '아키텍처', '', 'Advanced');

-- ===== 보안 =====
INSERT INTO certifications (name_ko, name_en, tag, sub_tag, level) VALUES
('마이데이터관리사', 'MyData Manager', '보안', '개인정보', 'Basic'),
('PIP (개인정보보호사)', 'PIP', '보안', '개인정보', 'Basic'),
('CPPG (개인정보관리사)', 'CPPG', '보안', '개인정보', 'Intermediate'),
('ISO 19011 인증심사원', 'ISO 19011 Auditor', '보안', '개인정보', 'Intermediate'),
('ISO 27701 (심사원보/심사원)', 'ISO 27701', '보안', '개인정보', 'Intermediate'),
('PIA (개인정보영향평가사)', 'PIA', '보안', '개인정보', 'Advanced'),
('ISO 27001 인증심사원', 'ISO 27001 Auditor', '보안', '개인정보', 'Advanced'),
('ISMS-P (심사원보/심사원/선임심사원)', 'ISMS-P', '보안', '개인정보', 'Master'),
('정보보안산업기사', 'Info Security Industrial', '보안', '정보보안', 'Basic'),
('CFSE (금융보안관리사)', 'CFSE', '보안', '정보보안', 'Intermediate'),
('정보보안기사', 'Info Security Engineer', '보안', '정보보안', 'Intermediate'),
('SSCP', 'SSCP', '보안', '정보보안', 'Intermediate'),
('CCSP', 'CCSP', '보안', '정보보안', 'Advanced'),
('CISSP (공인정보시스템 보안전문가)', 'CISSP', '보안', '정보보안', 'Advanced'),
('CISA (공인정보시스템 감사자)', 'CISA', '보안', '정보보안', 'Advanced'),
('정보시스템감리사', 'IS Auditor', '보안', '정보보안', 'Master');

-- ===== AI =====
INSERT INTO certifications (name_ko, name_en, tag, sub_tag, level) VALUES
('AIFB Basic', 'AIFB Basic', 'AI', '', 'Basic'),
('AICE Basic', 'AICE Basic', 'AI', '', 'Basic'),
('AICE Associate', 'AICE Associate', 'AI', '', 'Intermediate');

-- ===== Project Managing =====
INSERT INTO certifications (name_ko, name_en, tag, sub_tag, level) VALUES
('CSM', 'CSM', 'Project Managing', '', 'Basic'),
('CAPM', 'CAPM', 'Project Managing', '', 'Basic'),
('APM', 'APM', 'Project Managing', '', 'Intermediate'),
('CPMP', 'CPMP', 'Project Managing', '', 'Intermediate'),
('PPM', 'PPM', 'Project Managing', '', 'Intermediate'),
('CPD', 'CPD', 'Project Managing', '', 'Advanced'),
('Prince2 Practitioner', 'Prince2', 'Project Managing', '', 'Advanced'),
('PMP', 'PMP', 'Project Managing', '', 'Master');

-- ===== QA =====
INSERT INTO certifications (name_ko, name_en, tag, sub_tag, level) VALUES
('CSTS Foundation Level', 'CSTS Foundation', 'QA', '', 'Basic'),
('ISTQB', 'ISTQB', 'QA', '', 'Basic'),
('Six Sigma Green Belt', 'Six Sigma GB', 'QA', '', 'Basic'),
('CSTS Advanced Level', 'CSTS Advanced', 'QA', '', 'Advanced');

-- ===== Infra =====
INSERT INTO certifications (name_ko, name_en, tag, sub_tag, level) VALUES
('ITIL Foundation', 'ITIL Foundation', 'Infra', '', 'Basic'),
('정보기기운용기능사', 'IT Equipment Operator', 'Infra', '', 'Basic'),
('Certified Data Center Professional', 'CDCP', 'Infra', '', 'Basic'),
('Certified Data Center Specialist', 'CDCS', 'Infra', '', 'Intermediate'),
('Certified Data Center Expert', 'CDCE', 'Infra', '', 'Advanced');

-- ===== UX/UI =====
INSERT INTO certifications (name_ko, name_en, tag, sub_tag, level) VALUES
('컴퓨터그래픽스운용기능사', 'CG Operator', 'UX/UI', '', 'Basic'),
('Google UX Design Certificate', 'Google UX', 'UX/UI', '', 'Basic'),
('서비스경험디자인기사', 'Service Design Engineer', 'UX/UI', '', 'Intermediate'),
('컬러리스트기사', 'Colorist Engineer', 'UX/UI', '', 'Intermediate');

-- ===== 감사 =====
INSERT INTO certifications (name_ko, name_en, tag, sub_tag, level) VALUES
('CIA', 'CIA', '감사', '', 'Master');

-- ===== Solution =====
INSERT INTO certifications (name_ko, name_en, tag, sub_tag, level) VALUES
('SAP Basic', 'SAP Basic', 'Solution', 'SAP', 'Intermediate'),
('SAP Professional Certification', 'SAP Pro', 'Solution', 'SAP', 'Advanced'),
('SAS Certified Base Programmer', 'SAS Base', 'Solution', 'SAS', 'Basic'),
('SAS SCSBA', 'SAS SCSBA', 'Solution', 'SAS', 'Intermediate');

-- ===== 금융/기타 =====
INSERT INTO certifications (name_ko, name_en, tag, sub_tag, level) VALUES
('KBI 금융 DT', 'KBI Finance DT', '금융/기타', '', 'Basic'),
('외환전문역 1종', 'Forex Expert 1', '금융/기타', '', 'Basic'),
('증권투자권유자문인력', 'Securities Advisory', '금융/기타', '', 'Basic'),
('펀드투자권유자문인력', 'Fund Advisory', '금융/기타', '', 'Basic'),
('컴퓨터활용능력 1급', 'Computer Skills 1', '금융/기타', '', 'Basic'),
('보험대리점 / 변액보험', 'Insurance Agent', '금융/기타', '', 'Basic'),
('전산회계 1급', 'Computer Accounting 1', '금융/기타', '', 'Basic'),
('영업점 컴플라이언스 오피서(은행)', 'Compliance Officer', '금융/기타', '', 'Basic'),
('외환전문역 2종', 'Forex Expert 2', '금융/기타', '', 'Intermediate'),
('AFPK', 'AFPK', '금융/기타', '', 'Intermediate'),
('파생상품투자권유자문인력', 'Derivatives Advisory', '금융/기타', '', 'Intermediate'),
('투자자산운용사', 'Investment Manager', '금융/기타', '', 'Intermediate'),
('CAMS', 'CAMS', '금융/기타', '', 'Intermediate'),
('CGSS', 'CGSS', '금융/기타', '', 'Intermediate'),
('여신심사역 / 신용분석사', 'Credit Analyst', '금융/기타', '', 'Intermediate'),
('CFP', 'CFP', '금융/기타', '', 'Advanced'),
('신용위험분석사', 'Credit Risk Analyst', '금융/기타', '', 'Advanced'),
('재무위험관리사 (국내FRM)', 'FRM Domestic', '금융/기타', '', 'Advanced'),
('재무위험관리사 (국제 FRM)', 'FRM International', '금융/기타', '', 'Master');

-- ===== 샘플 시험 일정 데이터 =====
-- 정보처리기사
INSERT INTO exam_schedules (cert_id, round, reg_start, reg_end, exam_date, result_date)
SELECT id, 1, '2026-02-23'::timestamp, '2026-02-28'::timestamp, '2026-03-15'::date, '2026-04-11'::date
FROM certifications WHERE name_ko = '정보처리기사';

-- SQLD
INSERT INTO exam_schedules (cert_id, round, reg_start, reg_end, exam_date, result_date)
SELECT id, 55, '2026-03-02'::timestamp, '2026-03-13'::timestamp, '2026-04-05'::date, '2026-04-25'::date
FROM certifications WHERE name_ko = 'SQLD (SQL개발자)';

-- ADsP
INSERT INTO exam_schedules (cert_id, round, reg_start, reg_end, exam_date, result_date)
SELECT id, 45, '2026-03-09'::timestamp, '2026-03-20'::timestamp, '2026-04-12'::date, '2026-05-08'::date
FROM certifications WHERE name_ko = 'ADsP (데이터분석 준전문가)';

-- 빅데이터분석기사
INSERT INTO exam_schedules (cert_id, round, reg_start, reg_end, exam_date, result_date)
SELECT id, 10, '2026-03-16'::timestamp, '2026-03-27'::timestamp, '2026-04-19'::date, '2026-05-15'::date
FROM certifications WHERE name_ko = '빅데이터분석기사';

-- 정보보안기사
INSERT INTO exam_schedules (cert_id, round, reg_start, reg_end, exam_date, result_date)
SELECT id, 1, '2026-03-23'::timestamp, '2026-04-03'::timestamp, '2026-05-03'::date, '2026-06-05'::date
FROM certifications WHERE name_ko = '정보보안기사';
