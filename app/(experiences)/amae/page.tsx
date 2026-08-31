"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { EMPTY_SAVE, SaveState, loadSave, depPercent } from "./engine/types";

const DAYS = [
  { id: "prologue", label: "第〇課 · LESSON ZERO", jp: "やさしいこと", title: "SOMETHING KIND", href: "/amae/prologue",
    line: "Four years of a word thrown at your back. Tonight you find it on page eleven of the first book." },
  { id: "lesson-one", label: "第一課 · LESSON ONE", jp: "挨拶", title: "GREETINGS", href: "/amae/lesson-one",
    line: "Two weeks in, you go down to the village to introduce yourself. The book taught you how." },
  { id: "lesson-two", label: "第二課 · LESSON TWO", jp: "数字", title: "NUMBERS",
    line: "One bus a day. Numbers are the only thing in those books nobody had a reason to touch. Her shower is eleven minutes." },
  { id: "lesson-three", label: "第三課 · LESSON THREE", jp: "回覧板", title: "THE CIRCULATING NOTICE",
    line: "It goes house to house and every house signs it. Tonight it is your turn to sign." },
  { id: "lesson-four", label: "第四課 · LESSON FOUR", jp: "病院", title: "THE CLINIC",
    line: "You are ill. Volume four gave you the vocabulary for this. You use it on the doctor." },
  { id: "lesson-five", label: "第五課 · LESSON FIVE", jp: "祭", title: "THE FESTIVAL",
    line: "All sixty-one of them in one place. You introduce yourself forty times, correctly." },
  { id: "lesson-six", label: "第六課 · LESSON SIX", jp: "訂正", title: "THE CORRECTION",
    line: "Somebody is kind enough, or drunk enough, to tell you what you have been saying." },
  { id: "lesson-seven", label: "第七課 · LESSON SEVEN", jp: "雪", title: "SNOW",
    line: "The pass closes. It opens in April. You are on volume seven and ahead of schedule." },
  { id: "lesson-eight", label: "第八課 · LESSON EIGHT", jp: "名前", title: "THE NAME",
    line: "Nobody here has used yours in five weeks. Including you." },
  { id: "lesson-nine", label: "第九課 · LESSON NINE", jp: "帰国", title: "GOING HOME",
    line: "The flight lands. Your own city, your own language, everyone speaking it. Her coffee is on the table at the second she comes out of the bathroom." },
];

export default function AmaeHub() {
  const [save, setSave] = useState<SaveState>(EMPTY_SAVE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSave(loadSave());
    setMounted(true);
  }, []);

  if (!mounted) return <div className="amae-hub" />;

  return (
    <div className="amae-hub">
      <div className="amae-hub-grain" aria-hidden />

      <a className="amae-hub-creator" href="https://x.com/PrincessAzraiel"
         target="_blank" rel="noopener noreferrer">@PrincessAzraiel</a>

      <div className="amae-hub-inner">
        <header className="amae-hub-head">
          <div className="amae-hub-kanji">甘え</div>
          <h1 className="amae-hub-title">AMAE</h1>
          <p className="amae-hub-def">
            <em>n.</em> to depend helplessly on another&rsquo;s indulgence; to presume upon the
            affection of someone who owns you.
          </p>
          <div className="amae-hub-rule" />
          <p className="amae-hub-tag">forty volumes &nbsp;·&nbsp; you are getting better every week</p>
        </header>

        <section className="amae-hub-lore">
          <h2>[ 前提 &nbsp;·&nbsp; the arrangement ]</h2>
          <p>
            She spoke another language. Not at home — she went and got it, on purpose, around
            her second year at university, and then taught six or seven words of it to her friends
            so they could use them on you in the corridor. They did, for four years.
          </p>
          <p>
            You never found out what any of it meant. You never even established which language
            it was; that town had one bookshop, and this was before you could hold a phone up to
            a sound. You asked her once. She thought about it seriously, and told you it was
            something kind, and you have chosen to believe her every day for eleven years.
          </p>
          <p>
            In October she asked you for the first thing she has ever asked you for. Three months
            at her grandmother&rsquo;s house: a hamlet in the north, forty houses, sixty-one people,
            one bus a day, and nobody with a word of English. She has been planning it since
            before you could read a single character.
          </p>
          <p>
            There is a room at the back with a shelf in it, and the shelf is full — forty
            volumes in a beautiful old hand, graded readers, drills, exercises with a blank
            column for the student to copy into. She does not offer to teach you. She takes her
            tea to the other room and lets you find them, and you will thank her for it out loud,
            alone, at one in the morning.
          </p>
          <p>
            Every character in them is real. Your readings are correct. You are genuinely
            learning and you will get better every single week.
          </p>
          <p>
            She drinks coffee. She carried a hand grinder up a mountain for three months and did
            not pack a second cup. When you offer to make it, she says no &mdash; you would do it
            wrong, and then she would have to drink it &mdash; and that refusal will do more work
            on you than any order she could have given.
          </p>
          <p>
            By spring her cup will be on the table at the exact second she comes out of the
            bathroom, still hot, timed to a routine you wrote down in a notebook nobody asked you
            to start. She will never once have told you to.
          </p>
          <p className="amae-hub-emph">
            You will simply never be taught how to say <em>I have decided</em>, or <em>I would
            rather</em>, or <em>I am going to</em> — and a man can only think in what he has
            been given.
          </p>
</section>

        {save.dependency > 0 && (
          <div className="amae-hub-state">
            <span>甘え &nbsp; dependency</span>
            <span className="amae-hub-meter"><i style={{ width: depPercent(save.dependency) + "%" }} /></span>
            <b>{depPercent(save.dependency)}</b>
            <span className="amae-hub-words">
              {save.phrasebook.length} {save.phrasebook.length === 1 ? "word" : "words"}
              {save.rituals.length > 0 && (
                <> &nbsp;·&nbsp; 世話 {save.rituals.length}</>
              )}
            </span>
          </div>
        )}

        <div className="amae-hub-days">
          {DAYS.map((d) => {
            const open = Boolean(d.href);
            const done = save.completed.includes(d.id);
            return open ? (
              <Link key={d.id} href={d.href!} className={"amae-day" + (done ? " is-done" : "")}>
                <DayFace d={d} done={done} open />
              </Link>
            ) : (
              <div key={d.id} className="amae-day is-locked">
                <DayFace d={d} done={false} open={false} />
              </div>
            );
          })}
        </div>

        <footer className="amae-hub-foot">
          <Link href="/">← princessazraiel.com</Link>
        </footer>
      </div>

      <style dangerouslySetInnerHTML={{ __html: CSS }} />
    </div>
  );
}

function DayFace({
  d, done, open,
}: {
  d: (typeof DAYS)[number]; done: boolean; open: boolean;
}) {
  return (
    <>
      <div className="amae-day-top">
        <span className="amae-day-label">{d.label}</span>
        <span className="amae-day-status">
          {!open ? "近日 · soon" : done ? "済 · done" : "開 · open"}
        </span>
      </div>
      <div className="amae-day-name">
        <span className="amae-day-jp">{d.jp}</span>
        <span className="amae-day-en">{d.title}</span>
      </div>
      <p className="amae-day-line">{d.line}</p>
    </>
  );
}

const CSS = `
.amae-hub { position:relative; min-height:100dvh; background:#08080a; color:#c9c4bb;
  font-family:Georgia,"Times New Roman",serif; overflow-x:hidden; }
.amae-hub ::selection { background:#ff2e93; color:#fff; }
.amae-hub-grain { position:fixed; inset:0; pointer-events:none;
  background:
    radial-gradient(120% 90% at 50% 0%, rgba(160,170,185,.055), transparent 60%),
    radial-gradient(140% 110% at 50% 100%, rgba(0,0,0,.85), transparent 55%); }
.amae-hub-creator { position:absolute; top:18px; right:22px; z-index:5;
  font-family:ui-monospace,monospace; font-size:10px; letter-spacing:.24em; color:#4d463c;
  text-decoration:none; transition:.3s; }
.amae-hub-creator:hover { color:#ff4da6; }
.amae-hub-inner { position:relative; z-index:2; max-width:46rem; margin:0 auto;
  padding:14vh 22px 12vh; }

.amae-hub-head { text-align:center; }
.amae-hub-kanji { font-family:"Hiragino Kaku Gothic ProN","Yu Gothic","Noto Sans JP",Meiryo,sans-serif;
  font-size:clamp(60px,15vw,110px); color:#ff2e93; line-height:1;
  text-shadow:0 0 70px rgba(255,46,147,.35); }
.amae-hub-title { margin:.35em 0 0; font-size:clamp(26px,7vw,42px); letter-spacing:.44em;
  text-indent:.44em; font-weight:400; }
.amae-hub-def { margin:1.5em auto 0; max-width:30rem; font-size:15px; line-height:1.85;
  color:#6e6a63; font-style:italic; }
.amae-hub-def em { color:#c9c4bb; font-style:normal; }
.amae-hub-rule { height:1px; margin:2.4em auto; width:58%;
  background:linear-gradient(90deg,transparent,rgba(255,46,147,.6),transparent); }
.amae-hub-tag { font-family:ui-monospace,monospace; font-size:10px; letter-spacing:.26em;
  text-transform:uppercase; color:#5f574a; }

.amae-hub-lore { margin:5em 0 0; padding:28px 26px; border:1px solid rgba(110,106,99,.24);
  background:rgba(201,196,187,.015); }
.amae-hub-lore h2 { margin:0 0 1.4em; font-family:ui-monospace,monospace; font-size:11px;
  letter-spacing:.28em; text-transform:uppercase; color:#ff2e93; font-weight:400; }
.amae-hub-lore p { margin:0 0 1.2em; font-size:15px; line-height:1.95; color:#9a9080; }
.amae-hub-lore p:last-child { margin-bottom:0; }
.amae-hub-emph { color:#ff4da6 !important; font-style:italic; }

.amae-hub-state { margin:3em 0 0; display:flex; align-items:center; gap:12px; flex-wrap:wrap;
  font-family:ui-monospace,monospace; font-size:10px; letter-spacing:.22em;
  text-transform:uppercase; color:#6e6a63; }
.amae-hub-state b { color:#ff4da6; font-weight:400; }
.amae-hub-meter { display:inline-block; width:120px; height:3px; background:rgba(255,46,147,.2); }
.amae-hub-meter i { display:block; height:100%; background:#ff2e93;
  box-shadow:0 0 10px rgba(255,46,147,.8); }
.amae-hub-words { color:#4d463c; }

.amae-hub-days { margin:3.4em 0 0; display:flex; flex-direction:column; gap:12px; }
.amae-day { display:block; text-decoration:none; color:inherit; padding:20px 22px;
  border:1px solid rgba(110,106,99,.22); background:rgba(201,196,187,.012); transition:.35s; }
a.amae-day:hover { border-color:rgba(255,46,147,.7); background:rgba(255,46,147,.07);
  transform:translateX(4px); }
.amae-day.is-locked { opacity:.42; }
.amae-day.is-done { border-color:rgba(255,46,147,.35); }
.amae-day-top { display:flex; justify-content:space-between; align-items:center;
  font-family:ui-monospace,monospace; font-size:10px; letter-spacing:.26em;
  text-transform:uppercase; color:#5f574a; }
.amae-day.is-done .amae-day-top { color:#ff2e93; }
.amae-day-name { margin:.9em 0 .7em; display:flex; align-items:baseline; gap:14px;
  flex-wrap:wrap; }
.amae-day-jp { font-family:"Hiragino Kaku Gothic ProN","Yu Gothic","Noto Sans JP",Meiryo,sans-serif;
  font-size:22px; color:#79899a; letter-spacing:.06em; }
.amae-day-en { font-size:15px; letter-spacing:.2em; color:#c9c4bb; text-transform:uppercase; }
.amae-day-line { margin:0; font-size:14px; line-height:1.85; color:#6e6a63; font-style:italic; }

.amae-hub-foot { margin:5em 0 0; text-align:center; }
.amae-hub-foot a { font-family:ui-monospace,monospace; font-size:10px; letter-spacing:.24em;
  text-transform:uppercase; color:#4d463c; text-decoration:none; }
.amae-hub-foot a:hover { color:#6e6a63; }
@media (max-width:640px){ .amae-hub-inner{padding:10vh 18px 10vh} }
`;
