#!/usr/bin/env python3
"""
反射神経ゲーム - Reaction Time Game
「用意、スタート！」の後にランダムな時間で「今だ！」と表示。
Enterキーを押すまでの反応速度を測定します。
"""

import time
import random
import sys
import select
import termios
import tty


def flush_input():
    """入力バッファをクリアする"""
    termios.tcflush(sys.stdin, termios.TCIFLUSH)


def wait_for_enter():
    """Enterキーが押されるまで待ち、押された瞬間の時刻を返す"""
    sys.stdin.readline()
    return time.perf_counter()


def check_early_press(duration):
    """指定秒数の間にキー入力があったかチェック（フライング検出）"""
    old_settings = termios.tcgetattr(sys.stdin)
    try:
        tty.setcbreak(sys.stdin.fileno())
        start = time.perf_counter()
        while time.perf_counter() - start < duration:
            remaining = duration - (time.perf_counter() - start)
            if remaining <= 0:
                break
            ready, _, _ = select.select([sys.stdin], [], [], min(0.01, remaining))
            if ready:
                sys.stdin.read(1)
                return True
    finally:
        termios.tcsetattr(sys.stdin, termios.TCSADRAIN, old_settings)
    return False


def format_time(seconds):
    """反応時間を見やすくフォーマット"""
    ms = seconds * 1000
    if ms < 1000:
        return f"{ms:.1f} ミリ秒"
    else:
        return f"{seconds:.3f} 秒"


def get_rank(ms):
    """反応時間に応じたランクを返す"""
    if ms < 150:
        return "★★★★★ 超人的！本当に人間ですか？"
    elif ms < 200:
        return "★★★★☆ すばらしい！プロゲーマー級！"
    elif ms < 250:
        return "★★★☆☆ なかなか！平均より速い！"
    elif ms < 350:
        return "★★☆☆☆ 普通。もう少しがんばろう！"
    else:
        return "★☆☆☆☆ もっと集中！練習あるのみ！"


def play_round(round_num):
    """1ラウンドをプレイ。反応時間(秒)を返す。フライングはNone。"""
    print(f"\n{'='*40}")
    print(f"  ラウンド {round_num}")
    print(f"{'='*40}")
    print()
    print("  用意...")
    time.sleep(1.0)
    print("  スタート！")
    print()
    print("  （「今だ！」が出たらすぐ Enter を押せ！）")
    print()

    # ランダムな待ち時間（1.5〜5秒）
    wait_time = random.uniform(1.5, 5.0)

    # フライング検出
    if check_early_press(wait_time):
        print("  ＞＞＞ フライング！！！ ＜＜＜")
        print("  「今だ！」の前に押してしまいました...")
        print()
        return None

    # 「今だ！」表示
    print("  ╔══════════════════════╗")
    print("  ║                      ║")
    print("  ║    ！！今だ！！      ║")
    print("  ║                      ║")
    print("  ╚══════════════════════╝")
    print()

    start_time = time.perf_counter()

    # Enter待ち
    end_time = wait_for_enter()

    reaction = end_time - start_time
    ms = reaction * 1000

    print(f"  反応時間: {format_time(reaction)}")
    print(f"  評価: {get_rank(ms)}")

    return reaction


def main():
    print()
    print("  ╔══════════════════════════════════╗")
    print("  ║                                  ║")
    print("  ║      反射神経ゲーム              ║")
    print("  ║      Reaction Time Game          ║")
    print("  ║                                  ║")
    print("  ╠══════════════════════════════════╣")
    print("  ║  ルール:                         ║")
    print("  ║  「今だ！」が表示されたら        ║")
    print("  ║  できるだけ速く Enter を押せ！   ║")
    print("  ║                                  ║")
    print("  ║  ※ フライングは失格！           ║")
    print("  ╚══════════════════════════════════╝")
    print()

    total_rounds = 5
    results = []

    input("  Enter を押してスタート！ > ")
    flush_input()

    for i in range(1, total_rounds + 1):
        result = play_round(i)
        if result is not None:
            results.append(result)

        if i < total_rounds:
            input("\n  次のラウンドへ（Enter で続行）> ")
            flush_input()

    # 結果発表
    print()
    print(f"\n{'='*40}")
    print("  ===== 結果発表 =====")
    print(f"{'='*40}")
    print()

    if not results:
        print("  有効な記録がありません...全部フライング！？")
    else:
        for i, r in enumerate(results, 1):
            ms = r * 1000
            status = f"{ms:.1f} ms"
            print(f"  ラウンド {i}: {status}")

        print(f"\n  {'─'*30}")
        best = min(results)
        worst = max(results)
        avg = sum(results) / len(results)

        print(f"  最速:   {format_time(best)}")
        print(f"  最遅:   {format_time(worst)}")
        print(f"  平均:   {format_time(avg)}")
        print(f"\n  総合評価: {get_rank(avg * 1000)}")

    foul_count = total_rounds - len(results)
    if foul_count > 0:
        print(f"\n  フライング: {foul_count} 回")

    print()
    print("  お疲れ様でした！")
    print()


if __name__ == "__main__":
    main()
