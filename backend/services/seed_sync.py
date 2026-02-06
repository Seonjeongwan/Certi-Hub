"""
DB → seed-events.ts 자동 동기화 서비스

exam_schedules + certifications 테이블에서 데이터를 읽어
프론트엔드의 seed-events.ts 파일을 자동 생성합니다.

이 파일은 API 장애 시 fallback 용도로만 사용되며,
정상 운영 시에는 /api/schedules/calendar API가 실시간 데이터를 제공합니다.
"""

import os
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, List

from sqlalchemy import text
from sqlalchemy.orm import Session
from crawlers.base import get_sync_engine

logger = logging.getLogger("seed_sync")

# 프론트엔드 seed-events.ts 경로
FRONTEND_SEED_PATH = os.getenv(
    "FRONTEND_SEED_PATH",
    str(Path(__file__).resolve().parent.parent.parent / "frontend" / "lib" / "seed-events.ts"),
)


def _fetch_calendar_events(session: Session) -> List[Dict]:
    """
    DB에서 캘린더 이벤트 데이터 조회
    schedules.py의 get_calendar_events()와 동일한 로직 (동기 버전)
    """
    result = session.execute(text("""
        SELECT
            es.id,
            es.cert_id,
            es.round,
            es.reg_start,
            es.reg_end,
            es.exam_date,
            es.result_date,
            c.name_ko
        FROM exam_schedules es
        JOIN certifications c ON es.cert_id = c.id
        ORDER BY c.name_ko, es.round, es.exam_date
    """))

    events = []
    for row in result.fetchall():
        cert_id_str = str(row.cert_id)
        cert_name = row.name_ko
        round_no = row.round
        round_label = f" {round_no}회" if round_no else ""

        # 접수 기간 이벤트
        if row.reg_start and row.reg_end:
            reg_start = row.reg_start
            reg_end = row.reg_end
            # datetime → date string
            start_str = reg_start.strftime("%Y-%m-%d") if hasattr(reg_start, 'strftime') else str(reg_start)[:10]
            end_str = reg_end.strftime("%Y-%m-%d") if hasattr(reg_end, 'strftime') else str(reg_end)[:10]
            events.append({
                "title": f"{cert_name}{round_label} 접수",
                "start": start_str,
                "end": end_str,
                "color": "#93c5fd",
                "textColor": "#1e40af",
                "type": "registration",
                "cert_id": cert_id_str,
            })

        # 시험일 이벤트
        if row.exam_date:
            exam_str = row.exam_date.strftime("%Y-%m-%d") if hasattr(row.exam_date, 'strftime') else str(row.exam_date)[:10]
            events.append({
                "title": f"{cert_name}{round_label} 시험",
                "start": exam_str,
                "color": "#ef4444",
                "type": "exam",
                "cert_id": cert_id_str,
            })

        # 발표일 이벤트
        if row.result_date:
            result_str = row.result_date.strftime("%Y-%m-%d") if hasattr(row.result_date, 'strftime') else str(row.result_date)[:10]
            events.append({
                "title": f"{cert_name}{round_label} 발표",
                "start": result_str,
                "color": "#22c55e",
                "type": "result",
                "cert_id": cert_id_str,
            })

    return events


def _generate_ts_content(events: List[Dict]) -> str:
    """
    CalendarEvent[] 형식의 TypeScript 코드 생성
    """
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    lines = [
        'import type { CalendarEvent } from "./types";',
        '',
        '// ===================================================================',
        f'// 자동 생성 파일 — DB에서 동기화됨 ({now})',
        '// 이 파일은 API 장애 시 fallback 전용입니다.',
        '// 수동으로 수정하지 마세요. 크롤러 실행 시 자동으로 갱신됩니다.',
        '// ===================================================================',
        '',
        'export const INITIAL_EVENTS: CalendarEvent[] = [',
    ]

    for evt in events:
        parts = []
        parts.append(f'title: "{evt["title"]}"')
        parts.append(f'start: "{evt["start"]}"')
        if "end" in evt and evt["end"]:
            parts.append(f'end: "{evt["end"]}"')
        parts.append(f'color: "{evt["color"]}"')
        if "textColor" in evt and evt["textColor"]:
            parts.append(f'textColor: "{evt["textColor"]}"')
        parts.append(f'type: "{evt["type"]}"')
        parts.append(f'cert_id: "{evt["cert_id"]}"')

        line = "  { " + ", ".join(parts) + " },"
        lines.append(line)

    lines.append('];')
    lines.append('')

    return "\n".join(lines)


def sync_seed_events(output_path: str | None = None) -> Dict:
    """
    DB에서 시험 일정을 읽어 seed-events.ts를 생성/갱신합니다.

    Returns:
        {"status": "success", "events_count": N, "file_path": "..."}
    """
    target_path = output_path or FRONTEND_SEED_PATH
    engine = get_sync_engine()

    with Session(engine) as session:
        events = _fetch_calendar_events(session)

    if not events:
        logger.warning("DB에 시험 일정 데이터가 없음 — seed-events.ts 갱신하지 않음")
        return {
            "status": "skipped",
            "events_count": 0,
            "file_path": target_path,
        }

    ts_content = _generate_ts_content(events)

    # 파일 쓰기
    target = Path(target_path)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(ts_content, encoding="utf-8")

    logger.info(f"✅ seed-events.ts 생성 완료: {len(events)}건 → {target_path}")

    return {
        "status": "success",
        "events_count": len(events),
        "file_path": str(target_path),
    }


# CLI에서 직접 실행 가능
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(name)s] %(message)s")
    result = sync_seed_events()
    print(f"\n📝 결과: {result}")
