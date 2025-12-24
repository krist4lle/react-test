import AssessmentButton from "./components/AssessmentButton";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-16 text-zinc-900">
      <h1 className="text-2xl font-semibold">Patient Risk Assessment</h1>
      <p className="text-sm text-zinc-600">
        Click the button to start the assessment.
      </p>
      <AssessmentButton />
    </main>
  );
}
