// app/admin/components/HelpPanel.jsx
"use client";

export default function HelpPanel() {
    return (
        <div className="admin-editor prose" style={{ maxWidth: "72ch" }}>
            <h2>How publishing works</h2>
            <p>
                The site ships with built-in starter content. Anything you save here <b>overrides</b> the built-in content instantly — no rebuild, no developers, no downtime.
            </p>
            <ul>
                <li>
                    <b>Courses</b> edit text, modules, lessons and quizzes. Saving updates the catalog automatically.
                </li>
                <li>
                    <b>Topics</b> add a new topic here, then assign courses to it in the course editor. New topics appear across the site immediately.
                </li>
                <li>
                    <b>Reset</b> use <i>Reset to built-in</i> on any course to discard your override and restore the original.
                </li>
                <li>
                    <b>Backups</b> use <i>Download JSON</i> to keep a copy of any course on your computer.
                </li>
            </ul>

            <h2>Lesson types</h2>
            <ul>
                <li>
                    <b>Reading</b> markdown text: <code>## heading</code>, <code>**bold**</code>, <code>- bullet</code>, <code>&gt; quote</code>, numbered lists.
                </li>
                <li>
                    <b>Video</b> paste a YouTube or Vimeo <b>embed</b> URL (e.g. <code>https://www.youtube.com/embed/VIDEO_ID</code>).
                </li>
                <li>
                    <b>Quiz</b> questions with 4 choices each; learners must reach the pass mark. Explanations show after answering.
                </li>
            </ul>

            <h2>Good practice</h2>
            <ul>
                <li>Keep lessons under ~10 minutes; plain language; one idea per lesson.</li>
                <li>Every course should end with a quiz so learners can complete it and earn a certificate.</li>
                <li>Never give financial advice teach concepts, include the "education not advice" spirit.</li>
            </ul>
        </div>
    );
}