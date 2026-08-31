import VisualNovel from "../engine/VisualNovel";
import { prologue } from "../script/prologue";

export const metadata = { title: "AMAE — 第〇課 · やさしいこと" };

export default function Page() {
  return <VisualNovel day={prologue} />;
}
