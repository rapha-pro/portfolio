import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { AnimatedGithub } from "@/components/ui/icons/animated-github"
import { PROJECTS } from "@/lib/data/projects"
import { TechBadge } from "@/components/projects/tech-badge"
import {
    AccuracyHeatmap,
    ConfusionMatrix,
    ReportFigure,
    ReportSection,
    ReportTable,
    StatRow,
} from "@/components/projects/report-blocks"

const project = PROJECTS.find((p) => p.slug === "predictive-maintenance-ml")!

const FIG = "/images/projects/predictive-maintenance-ml"

/** Sources cited in the page, numbered in order of the Cite markers. */
const REFERENCES = [
    {
        text: "Siemens, Senseye Predictive Maintenance. The True Cost of Downtime 2024.",
        label: "assets.new.siemens.com",
        url: "https://assets.new.siemens.com/siemens/assets/api/uuid:1b43afb5-2d07-47f7-9eb7-893fe7d0bc59/tcod-2024_original.pdf",
    },
    {
        text: "U.S. Department of Energy, Federal Energy Management Program. Operations & Maintenance Best Practices: A Guide to Achieving Operational Efficiency, Release 2.0 (PNNL 14788), 2004, section 5.4.",
        label: "pnnl.gov",
        url: "https://www.pnnl.gov/main/publications/external/technical_reports/pnnl-14788.pdf",
    },
    {
        text: "UCI Machine Learning Repository. AI4I 2020 Predictive Maintenance Dataset.",
        label: "archive.ics.uci.edu",
        url: "https://archive.ics.uci.edu/dataset/601/ai4i+2020+predictive+maintenance+dataset",
    },
]

/**
 * Purpose:
 *   Custom detail page for the predictive maintenance project, written as a
 *   short research paper: why it matters in a plant, then data, hypotheses,
 *   methods, results, threshold selection, error analysis, and next steps.
 *
 * Returns:
 *   Full project detail page with hero image, GitHub link, figures, result
 *   tables, confusion matrices, and tech stack.
 */
export default function PredictiveMaintenancePage() {
    if (!project) notFound()

    return (
        <main className="min-h-screen">
            {/* Hero image */}
            <div className="relative h-[55vh] w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={project.image}
                    alt={project.title}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 50%, var(--bg) 100%)",
                    }}
                />
                <div className="absolute left-6 top-6">
                    <Link
                        href="/#projects"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-black/30 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-black/50"
                    >
                        <ArrowLeft size={15} />
                        Back
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-3xl px-6 pb-32 pt-10">
                <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.2em] text-accent">
                    {project.context} &bull; {"Predicting Machine Failures"}
                </p>

                <h1 className="mb-6 text-4xl font-bold text-brand md:text-5xl">{project.title}</h1>

                {/* Link buttons */}
                {project.githubUrl && (
                    <div className="mb-10 flex flex-wrap gap-3">
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-app bg-[var(--glass)] px-4 py-2.5 text-sm font-medium text-brand backdrop-blur-sm transition-all duration-200 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                        >
                            <AnimatedGithub size={16} />
                            GitHub
                        </a>
                    </div>
                )}

                <div className="flex flex-col gap-12">
                    <ReportSection>
                        <p>
                            Every machine wears out, no matter how well it is built. Its quality
                            decides how well it performs and how long it lasts, but sooner or later,
                            something gives.
                        </p>
                        <p>
                            To avoid breakdowns in the middle of production, many factories replace
                            parts on a fixed calendar, whether the part needs it or not. It works,
                            but it is wasteful: the U.S. Department of Energy lists &ldquo;unneeded
                            maintenance&rdquo; as a built in cost of calendar based programs{" "}
                            <Cite n={2} />, and Siemens points to lines closed for no reason and
                            expensive spare parts kept on the shelf just in case <Cite n={1} />.
                            Wait too long instead, and a single hour of unplanned downtime in a
                            large car plant now costs about $2.3 million <Cite n={1} />.
                        </p>
                        <div className="rounded-xl border-l-2 border-[color:var(--accent)] bg-[var(--glass)] px-5 py-4">
                            <p>This project asks a simple question:</p>
                            <p className="mt-1 text-lg font-semibold text-brand">
                                Can a machine&apos;s own sensor readings warn us before it fails?
                            </p>
                        </div>
                        <p>
                            We dig into what a machine reports about itself (temperature, speed,
                            torque, and tool wear) and test whether machine learning can turn those
                            readings into an early warning. The hard part is that failures are rare,
                            about 3 in every 100 runs. A model that always says{" "}
                            <em>&ldquo;everything is fine&rdquo;</em> would be right 96.6% of the
                            time and still miss every single breakdown.
                        </p>
                        <p>
                            So instead of just training a model, we ran it like a small research
                            study: explore the data, form hypotheses, test them with models chosen
                            for a reason, and dig into the failures the final model still misses.
                            The result catches more than twice as many failures as a simple
                            baseline, and about two in three of its alerts are real.
                        </p>
                        <StatRow
                            stats={[
                                { value: "10,000", label: "machine runs, 6 input features" },
                                { value: "3.39%", label: "of runs end in a failure" },
                                {
                                    value: "5",
                                    label: "models compared with 5 fold cross validation",
                                },
                                {
                                    value: "69%",
                                    label: "of the final model's alerts were real failures",
                                },
                            ]}
                        />
                    </ReportSection>

                    <ReportSection title="How This Helps in a Real Factory">
                        <p>
                            Unplanned downtime is one of the most expensive problems in
                            manufacturing. Siemens&apos; 2024 survey of industrial companies puts
                            numbers on it <Cite n={1} />:
                        </p>
                        <StatRow
                            stats={[
                                {
                                    value: "−$1.4T",
                                    label: "lost every year by the world's 500 largest companies, 11% of their revenue",
                                },
                                {
                                    value: "−$2.3M",
                                    label: "the cost of one hour of downtime in a large car plant",
                                },
                                {
                                    value: "27 h",
                                    label: "of unplanned downtime per month at an average large plant",
                                },
                                {
                                    value: "−$253M",
                                    label: "yearly cost of downtime for an average large plant",
                                },
                            ]}
                            tone="loss"
                        />
                        <p>
                            Predictive maintenance is how plants fight back. In independent surveys
                            gathered by the U.S. Department of Energy, plants that started a working
                            predictive maintenance program reported these average results{" "}
                            <Cite n={2} />:
                        </p>
                        <StatRow
                            stats={[
                                { value: "25 to 30%", label: "lower maintenance costs" },
                                { value: "70 to 75%", label: "fewer breakdowns" },
                                { value: "35 to 45%", label: "less downtime" },
                                { value: "+10x", label: "return on the investment" },
                            ]}
                            tone="gain"
                        />
                        <p>
                            In hours: an average large plant loses 27 hours a month to unplanned
                            downtime <Cite n={1} />. Cutting that by 35 to 45% <Cite n={2} /> gives
                            back about 9 to 12 hours of production every month, more than a full 8
                            hour shift.
                        </p>
                        <p>Here is what our analysis adds to that picture:</p>
                        <LeadList
                            items={[
                                {
                                    lead: "Less time checking healthy machines.",
                                    body: "Instead of inspecting everything on a calendar, the crew checks only what the model flags: 52 of our 2,000 test runs, about 2.6%, and two in three of those were real failures.",
                                },
                                {
                                    lead: "Fewer surprise breakdowns.",
                                    body: "The model caught 36 of 68 failures before they happened, more than twice the 16 caught by a simple baseline.",
                                },
                                {
                                    lead: "A dial, not a fixed answer.",
                                    body: "The decision threshold trades caught failures against false alarms. A plant where a breakdown costs far more than an inspection can lower it and catch more failures (Table 7).",
                                },
                                {
                                    lead: "Operating rules a technician can read.",
                                    body: "Risk concentrates in a few zones: the highest fifth of torque fails at 11.5%, the lowest fifth of rotational speed at 12.2%, and tool wear above about 174 minutes at 8.1%, against 3.4% overall.",
                                },
                                {
                                    lead: "Known blind spots.",
                                    body: "The error analysis shows which failures the model tends to miss, so those cases can be covered by inspections instead of trusting the model.",
                                },
                            ]}
                        />
                        <p>
                            What a plant cares about is not accuracy but the alert queue: how many
                            failures are caught in time, and how many technicians are sent to
                            machines that were fine. On our 2,000 held out runs, which contain 68
                            real failures, three strategies look very different:
                        </p>
                        <ReportTable
                            caption="Table 1: The same 2,000 test runs under three maintenance strategies"
                            headers={[
                                "Strategy",
                                "Failures caught",
                                "Alerts raised",
                                "Alerts that were real",
                            ]}
                            rows={[
                                ["Wait for breakdowns (no model)", "0 of 68", "0", "none"],
                                ["Balanced logistic regression", "51 of 68", "418", "12%"],
                                ["Balanced Random Forest (ours)", "36 of 68", "52", "69%"],
                            ]}
                            highlightRow={2}
                            note="The linear model catches more failures, but only by sending crews to 367 healthy machines. The forest raises 52 alerts and about two in three of them are real."
                        />
                        <p>
                            These results come from a benchmark dataset, not a live factory. The
                            industry figures above show the size of the prize; the rest of this page
                            shows how far a careful model gets toward it, and where it still falls
                            short.
                        </p>
                    </ReportSection>

                    <ReportSection title="1. The Data">
                        <p>
                            The data is the AI4I 2020 Predictive Maintenance Dataset from the UCI
                            Machine Learning Repository <Cite n={3} />. It is synthetic, but it was
                            built to reflect predictive maintenance data seen in industry, and it
                            keeps the properties that make the real problem hard:
                        </p>
                        <LeadList
                            items={[
                                {
                                    lead: "Ordinary signals.",
                                    body: "Air and process temperature, rotational speed, torque, and how long the current tool has been in use: the kind of readings a machine controller already logs.",
                                },
                                {
                                    lead: "Failures with physical causes.",
                                    body: "Runs fail from heat dissipation problems, power outside the safe range, overstrain, tool wear, and a small share of random failures, the same mechanisms maintenance engineers reason about.",
                                },
                                {
                                    lead: "Rare failures.",
                                    body: "Breakdowns are a few percent of all runs, so a model has very few examples of what it must catch.",
                                },
                            ]}
                        />
                        <p>
                            The dataset has 10,000 runs and 14 columns, with no missing values and
                            no duplicate rows. Each run has a product quality type (L, M, or H, in a
                            60, 30, and 10 percent mix) and five numeric readings. The target is a
                            single flag, machine failure: 339 runs fail and 9,661 do not.
                        </p>
                        <p>
                            We dropped the identifier columns and, more importantly, the five
                            failure mode flags (tool wear, heat dissipation, power, overstrain, and
                            random failure). Those flags are only known after a run has failed, so
                            feeding them to the model would leak the answer.
                        </p>
                    </ReportSection>

                    <ReportSection title="2. Exploring the Data">
                        <p>
                            We first compared the average reading of failed and normal runs. Torque
                            and tool wear stand out; temperature barely moves.
                        </p>
                        <ReportTable
                            caption="Table 2: Average readings of normal and failed runs"
                            headers={["Reading", "Normal runs", "Failed runs", "Difference"]}
                            rows={[
                                ["Torque (Nm)", "39.63", "50.17", "26.6% higher"],
                                ["Tool wear (min)", "106.69", "143.78", "34.8% higher"],
                                ["Rotational speed (rpm)", "1,540.26", "1,496.49", "2.8% lower"],
                                ["Air temperature (K)", "299.97", "300.89", "0.92 K higher"],
                                ["Process temperature (K)", "310.00", "310.29", "0.29 K higher"],
                            ]}
                        />
                        <p>
                            Averages can mislead: a feature whose means differ a lot can still
                            overlap heavily, while a feature with a small mean shift can be
                            dangerous only in one narrow range. So we looked at the full
                            distributions next.
                        </p>
                        <ReportFigure
                            src={`${FIG}/eda_boxplots.png`}
                            alt="Box plots of the five sensor readings for normal and failed runs"
                            caption="Figure 1: Readings of normal (0) and failed (1) runs. The boxes for torque and rotational speed barely overlap; air temperature and tool wear shift upward; process temperature looks almost the same."
                        />
                        <p>
                            To see the shape of the risk, we split each reading into five equal
                            sized groups and measured the failure rate in each.
                        </p>
                        <AccuracyHeatmap
                            caption="Table 3: Failure rate by fifth of each reading, from lowest to highest values"
                            rowLabel="Reading"
                            rows={["Air temp", "Process temp", "Speed", "Torque", "Tool wear"]}
                            cols={["Lowest", "2nd", "3rd", "4th", "Highest"]}
                            values={[
                                [2.15, 2.52, 1.96, 3.2, 7.23],
                                [2.49, 1.71, 4.78, 4.27, 3.9],
                                [12.16, 1.44, 0.6, 0.45, 2.26],
                                [2.35, 0.45, 0.59, 2.17, 11.5],
                                [2.37, 2.09, 2.33, 2.15, 8.14],
                            ]}
                            digits={1}
                            suffix="%"
                            note="The risk is not a straight line. Speed and torque are U shaped, safest in the middle and riskiest at one extreme, and tool wear is flat until the last fifth, where it jumps to 8.1%."
                        />
                    </ReportSection>

                    <ReportSection title="3. Hypotheses">
                        <p>The exploration gave us five claims to test with models:</p>
                        <ol className="flex flex-col gap-3">
                            {[
                                "Torque and rotational speed are the strongest signals, since their distributions separate the most.",
                                "The relationship between readings and failure is non linear, so linear models will struggle and models that learn thresholds will do better.",
                                "Tool wear matters, but mostly at its extreme.",
                                "Temperature is weak on its own but may still help in combination with other readings.",
                                "Machines slow down as they wear, which would explain why failed runs have lower average speed.",
                            ].map((h, i) => (
                                <li key={h} className="flex gap-3">
                                    <span className="mt-0.5 shrink-0 rounded-md bg-[color:var(--accent-soft)] px-1.5 py-0.5 font-mono text-[12px] font-semibold text-accent">
                                        H{i + 1}
                                    </span>
                                    <span>{h}</span>
                                </li>
                            ))}
                        </ol>
                        <p>
                            We flagged H5 early as one we could not settle here: it is about a
                            single machine changing over time, and this dataset has no machine
                            histories.
                        </p>
                    </ReportSection>

                    <ReportSection title="4. Methods">
                        <p>
                            Each model was chosen to answer a question, not to try everything in a
                            library:
                        </p>
                        <ReportTable
                            caption="Table 4: Candidate models and why each one is in the comparison"
                            headers={["Model", "Why we chose it", "Question it answers"]}
                            rows={[
                                [
                                    "Logistic regression",
                                    "Simple, fast, one weight per feature",
                                    "Is a straight line boundary enough?",
                                ],
                                [
                                    "Balanced logistic regression",
                                    "Missed failures weigh about 28 times more",
                                    "Does reweighting fix the imbalance?",
                                ],
                                [
                                    "SVM, RBF kernel",
                                    "Kernel trick bends the boundary",
                                    "Does a smooth curved boundary help?",
                                ],
                                [
                                    "Random Forest, 200 trees",
                                    "Trees learn threshold rules",
                                    "Do threshold rules match the risk shape?",
                                ],
                                [
                                    "Balanced Random Forest",
                                    "Same forest with class weights",
                                    "Does reweighting help the forest too?",
                                ],
                            ]}
                        />
                        <LeadList
                            items={[
                                {
                                    lead: "Logistic regression",
                                    body: "is the baseline. If H2 is right, its single straight boundary cannot follow U shaped risk.",
                                },
                                {
                                    lead: "The SVM",
                                    body: "uses the kernel trick: an RBF kernel compares runs by similarity, which lets it draw a curved boundary without us building features by hand. We wrapped it in sigmoid calibration so it outputs probabilities like the other models.",
                                },
                                {
                                    lead: "Random Forests",
                                    body: "split on thresholds such as torque above a value, which is exactly the shape Table 3 shows. Averaging 200 trees reduces the variance of a single tree, and the forest reports which features it relies on, which lets us check H1, H3, and H4.",
                                },
                            ]}
                        />
                        <p>
                            All models share one pipeline: numeric readings are standardized and the
                            product type is one hot encoded, fitted inside each training fold so no
                            statistics leak from validation data. The data is split 80/20 with
                            stratification, giving 8,000 training and 2,000 test runs with the same
                            3.4% failure rate. Models are compared by 5 fold stratified cross
                            validation on the training set, using the F1 score of the failure class
                            as the main metric, because it rewards catching failures (recall) and
                            keeping alerts trustworthy (precision) at the same time. The test set is
                            used last.
                        </p>
                    </ReportSection>

                    <ReportSection title="5. Results">
                        <ReportTable
                            caption="Table 5a: 5 fold cross validation on the training set, failure class"
                            headers={["Model", "Precision", "Recall", "F1", "F1 std"]}
                            rows={[
                                ["Balanced Random Forest", "0.718", "0.660", "0.688", "0.034"],
                                ["Random Forest", "0.938", "0.543", "0.682", "0.074"],
                                ["SVM, RBF kernel", "0.297", "0.886", "0.445", "0.013"],
                                ["Logistic regression", "0.738", "0.177", "0.281", "0.044"],
                                [
                                    "Balanced logistic regression",
                                    "0.141",
                                    "0.820",
                                    "0.241",
                                    "0.006",
                                ],
                            ]}
                            highlightRow={0}
                            note="Both forests clearly lead. The balanced forest wins on F1 and is about twice as stable across folds as the unweighted one (0.034 against 0.074), so it became our candidate."
                        />
                        <ReportTable
                            caption="Table 5b: Held out test set at the default threshold of 0.5"
                            headers={["Model", "Accuracy", "Precision", "Recall", "F1"]}
                            rows={[
                                ["Logistic regression", "0.971", "0.727", "0.235", "0.356"],
                                [
                                    "Balanced logistic regression",
                                    "0.808",
                                    "0.122",
                                    "0.750",
                                    "0.210",
                                ],
                                ["SVM, RBF kernel", "0.975", "0.774", "0.353", "0.485"],
                                ["Balanced Random Forest", "0.976", "0.679", "0.559", "0.613"],
                                ["Random Forest", "0.979", "0.783", "0.529", "0.632"],
                            ]}
                            highlightRow={3}
                            note="Accuracy hardly moves between models while F1 nearly doubles, which is why accuracy alone would have told us nothing. The unweighted forest edges ahead on this single split; we kept the cross validated choice, which averages five splits instead of one."
                        />
                        <p>
                            The SVM did better than logistic regression but never balanced the two
                            sides: in cross validation it caught 89% of failures with only 30% of
                            its alerts real, and on the test set it swung the other way, catching
                            35%. Reweighting logistic regression showed the same problem in its
                            purest form: recall jumped from 24% to 75% while precision collapsed
                            from 73% to 12%.
                        </p>
                        <ReportFigure
                            src={`${FIG}/feature_importance.png`}
                            alt="Random Forest feature importance bar chart"
                            caption="Figure 2: What the balanced Random Forest relies on. Rotational speed (0.311) and torque (0.297) lead, then tool wear (0.204), air temperature (0.099), and process temperature (0.073). The three product types together add about 0.015."
                        />
                        <ReportTable
                            caption="Table 6: The hypotheses against the evidence"
                            headers={["Hypothesis", "Evidence", "Verdict"]}
                            rows={[
                                [
                                    "H1 Torque and speed lead",
                                    "Top two features, 61% of importance",
                                    "Supported",
                                ],
                                [
                                    "H2 Non linear risk",
                                    "Forest F1 0.688 against 0.281 for the linear baseline",
                                    "Supported",
                                ],
                                [
                                    "H3 Tool wear at the extreme",
                                    "Third feature, 0.204; but see the error analysis",
                                    "Partly",
                                ],
                                [
                                    "H4 Temperature helps a little",
                                    "Together about 17% of importance",
                                    "Supported",
                                ],
                                [
                                    "H5 Machines slow down",
                                    "Needs machine histories over time",
                                    "Open",
                                ],
                            ]}
                        />
                        <p>
                            Feature importance describes how the trained forest makes its
                            predictions. It does not prove that raising torque causes failure, and
                            correlated readings such as torque and speed can share importance
                            between them.
                        </p>
                    </ReportSection>

                    <ReportSection title="6. Choosing a Threshold Without Peeking">
                        <p>
                            A forest outputs a probability, and the threshold that turns it into an
                            alert is a decision in its own right. Our first attempt picked the
                            threshold that maximized F1 on the test set: 0.40, with an F1 of 0.639.
                            We then caught the flaw. Choosing anything with the test labels makes
                            the test score optimistic, because the test set is no longer unseen.
                        </p>
                        <p>
                            The corrected procedure uses the training set only. We produced out of
                            fold probabilities with 5 fold cross validation, so every training run
                            is scored by a model that never saw it, picked the threshold with the
                            best F1 there (0.52, cross validated F1 0.697), refit the forest on all
                            training data, and applied 0.52 once to the test set.
                        </p>
                        <ReportFigure
                            src={`${FIG}/threshold_selection.png`}
                            alt="Precision, recall, and F1 against the probability threshold"
                            caption="Figure 3: Precision, recall, and F1 for every threshold, from out of fold predictions on the training set. F1 peaks at 0.52."
                        />
                        <ReportTable
                            caption="Table 7: Operating points the plant could choose (cross validated, training set)"
                            headers={["Threshold", "Precision", "Recall", "F1"]}
                            rows={[
                                ["0.20", "0.408", "0.882", "0.558"],
                                ["0.30", "0.514", "0.834", "0.636"],
                                ["0.40", "0.609", "0.760", "0.677"],
                                ["0.52", "0.747", "0.653", "0.697"],
                                ["0.60", "0.828", "0.550", "0.661"],
                                ["0.70", "0.936", "0.432", "0.591"],
                            ]}
                            highlightRow={3}
                            note="At 0.30 the model would catch about 83% of failures with half of its alerts real; at 0.70 almost every alert is real but fewer than half of failures are caught."
                        />
                        <div className="grid gap-6 md:grid-cols-2">
                            <ConfusionMatrix
                                caption="Baseline: logistic regression"
                                matrix={[
                                    [1926, 6],
                                    [52, 16],
                                ]}
                                labels={["no failure", "failure"]}
                            />
                            <ConfusionMatrix
                                caption="Final: balanced forest at 0.52"
                                matrix={[
                                    [1916, 16],
                                    [32, 36],
                                ]}
                                labels={["no failure", "failure"]}
                            />
                        </div>
                        <p>
                            The honest result on the test set is precision 0.69, recall 0.53, and F1
                            0.60. It is lower than the 0.639 from the first attempt, and it is the
                            number we report. Compared with the baseline, the final model catches
                            more than twice as many failures (36 against 16) for 10 extra false
                            alarms.
                        </p>
                    </ReportSection>

                    <ReportSection title="7. Error Analysis">
                        <p>
                            The final model still misses 32 of 68 failures. To understand why, we
                            compared the failures it caught with the ones it missed.
                        </p>
                        <ReportTable
                            caption="Table 8: Median readings of caught and missed failures on the test set"
                            headers={["Reading", "Caught (36)", "Missed (32)"]}
                            rows={[
                                ["Torque (Nm)", "55.40", "47.65"],
                                ["Rotational speed (rpm)", "1,356", "1,440"],
                                ["Tool wear (min)", "120.5", "165.0"],
                                ["Air temperature (K)", "301.90", "300.65"],
                                ["Process temperature (K)", "310.55", "310.70"],
                                ["Model's failure probability", "0.74", "0.22"],
                            ]}
                        />
                        <LeadList
                            items={[
                                {
                                    lead: "It learned the main pattern well.",
                                    body: "Caught failures sit at high torque and low speed, the dominant failure zone in Table 3. Failures at moderate torque look normal to the model.",
                                },
                                {
                                    lead: "Wear related failures slip through.",
                                    body: "Missed failures had more tool wear (median 165 minutes against 120.5), so the model leans on torque and speed and underweights wear when the other readings look ordinary.",
                                },
                                {
                                    lead: "The other end of the U is rare.",
                                    body: "Two missed failures ran at about 2,500 to 2,700 rpm with only 11 to 13 Nm of torque. High speed, low torque failures are uncommon in the training data, so the forest has few examples to learn them from.",
                                },
                                {
                                    lead: "Some misses cannot be fixed by the threshold.",
                                    body: "A quarter of the missed failures received a probability of 0.06 or less, the lowest close to 0. No threshold catches those; they need new information, not a different cut off.",
                                },
                            ]}
                        />
                    </ReportSection>

                    <ReportSection title="8. Limitations">
                        <ul className="flex flex-col gap-2">
                            {[
                                "The data is a synthetic benchmark and may not match a particular factory, machine fleet, or maintenance policy.",
                                "A random split can be optimistic when runs depend on each other over time.",
                                "F1 weighs precision and recall equally; a real plant should weigh them by cost.",
                                "The forest's probabilities are not calibrated, so 0.7 does not yet mean a 70% chance of failure.",
                            ].map((item) => (
                                <Bullet key={item}>{item}</Bullet>
                            ))}
                        </ul>
                    </ReportSection>

                    <ReportSection title="9. What We Recommend Next">
                        <LeadList
                            items={[
                                {
                                    lead: "Engineer physical features.",
                                    body: "The dataset documentation defines three failure modes with combined quantities: power (torque times angular speed) outside 3,500 to 9,000 W, overstrain when tool wear times torque passes 11,000 to 13,000 min·Nm depending on product type, and heat dissipation when the gap between process and air temperature is under 8.6 K at speeds under 1,380 rpm. The failure flags in the data follow these rules exactly. A forest has to approximate a product like torque times speed with many single feature splits, so giving it power, strain, and the temperature gap directly should help most with the missed high speed, low torque and high wear cases.",
                                },
                                {
                                    lead: "Set the threshold from costs.",
                                    body: "Price a missed failure and an unnecessary inspection, account for how many alerts the crew can handle, and pick the operating point in Table 7 that minimizes total cost instead of maximizing F1.",
                                },
                                {
                                    lead: "Try gradient boosting.",
                                    body: "It was on our original plan and is the natural next comparison, since it builds trees one after another to fix the previous trees' mistakes, including the rare failure patterns.",
                                },
                                {
                                    lead: "Calibrate, then validate on real time ordered data.",
                                    body: "Calibrated probabilities would let a planner read the score as a real risk. Validating on machine histories ordered in time would give an honest estimate for deployment and is the only way to test H5.",
                                },
                            ]}
                        />
                    </ReportSection>

                    <ReportSection title="Reproducibility">
                        <p>
                            The analysis started in two Jupyter notebooks, one for exploration and
                            one for modeling, and was then refactored into a small Python package so
                            the notebooks and the training script share the same code. A single
                            command retrains all five candidates, selects the threshold with cross
                            validation, and saves the production pipeline, the threshold, the
                            metrics, and every figure on this page.
                        </p>
                        <p>
                            A solo personal project: I did the analysis, the modeling, and the
                            pipeline end to end.
                        </p>
                    </ReportSection>

                    <ReportSection title="References">
                        <ol className="flex flex-col gap-2 text-[13px]">
                            {REFERENCES.map((ref, i) => (
                                <li key={ref.url} id={`ref-${i + 1}`} className="flex gap-2">
                                    <span className="shrink-0 font-mono text-accent">
                                        [{i + 1}]
                                    </span>
                                    <span>
                                        {ref.text}{" "}
                                        <a
                                            href={ref.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="break-all text-accent underline-offset-2 hover:underline"
                                        >
                                            {ref.label}
                                        </a>
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </ReportSection>

                    {/* Tech stack */}
                    <div>
                        <h2 className="mb-4 text-lg font-semibold text-brand">Technologies</h2>
                        <div className="flex flex-wrap gap-2">
                            {project.tech.map((t) => (
                                <TechBadge key={t} name={t} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

/** Accent dot list item, matching the other report pages. */
/** Numbered superscript link to an entry in the References section. */
function Cite({ n }: { n: number }) {
    return (
        <sup className="font-mono text-[11px]">
            <a href={`#ref-${n}`} className="text-accent hover:underline">
                [{n}]
            </a>
        </sup>
    )
}

function Bullet({ children }: { children: React.ReactNode }) {
    return (
        <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
            <span>{children}</span>
        </li>
    )
}

/** Bulleted list where each item opens with a bold lead phrase. */
function LeadList({ items }: { items: { lead: string; body: string }[] }) {
    return (
        <ul className="flex flex-col gap-3">
            {items.map((item) => (
                <Bullet key={item.lead}>
                    <span className="font-semibold text-brand">{item.lead}</span> {item.body}
                </Bullet>
            ))}
        </ul>
    )
}
