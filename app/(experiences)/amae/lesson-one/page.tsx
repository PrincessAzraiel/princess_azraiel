import VisualNovel from "../engine/VisualNovel";
import { lessonOne } from "../script/lesson-one";

export const metadata = { title: "AMAE · 第一課 · 挨拶" };

export default function Page() {
  return <VisualNovel day={lessonOne} />;
}
