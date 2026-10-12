import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { PROJECTS } from "@/lib/data/projects"
import { TechBadge } from "@/components/projects/tech-badge"
import { ReportLineChart, ReportSection, ReportTable } from "@/components/projects/report-blocks"

const project = PROJECTS.find((p) => p.slug === "pca-kmeans-a3")!

/**
 * Purpose:
 *   Custom detail page for COMP 3105 Assignment 3: multiclass classification,
 *   PCA, and k-means built from scratch. Explains what each method is for,
 *   what we implemented, and reproduces the results from the report.
 *
 * Returns:
 *   Full project detail page with hero image, structured sections, result
 *   tables, the k-means elbow chart, and tech stack.
 */
export default function PcaKmeansPage() {
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
                    {project.period} &bull; {project.context}
                </p>

                <h1 className="mb-6 text-4xl font-bold text-brand md:text-5xl">{project.title}</h1>

                <div className="flex flex-col gap-10">
                    <ReportSection>
                        <p>
                            Classifying into many classes, compressing data into fewer dimensions,
                            and finding groups in unlabeled data are three tasks that show up in
                            almost every real machine learning pipeline. In this assignment we built
                            the standard tool for each from scratch in NumPy and SciPy, so every
                            step, from the loss function to the eigendecomposition, is code we wrote
                            and can explain.
                        </p>
                    </ReportSection>

                    <ReportSection title="What We Built">
                        <ul className="flex flex-col gap-3">
                            {[
                                {
                                    lead: "Multinomial logistic regression.",
                                    body: "A linear classifier for k classes that minimizes the multinomial deviance (cross entropy), written with log-sum-exp for numerical stability and optimized with SciPy.",
                                },
                                {
                                    lead: "PCA and kernel PCA.",
                                    body: "PCA centers the data and takes the top eigenvectors of its covariance, then projects new points onto them. Kernel PCA does the same through a kernel matrix, so it can capture curved structure.",
                                },
                                {
                                    lead: "k-means.",
                                    body: "Lloyd's algorithm with random starting centers, repeated 100 times to keep the run with the lowest objective, plus a sweep over k from 2 to 9 to choose the number of clusters.",
                                },
                                {
                                    lead: "Kernel k-means.",
                                    body: "Clustering through a Gaussian kernel, which can separate shapes such as two interleaving moons that plain k-means cannot.",
                                },
                            ].map((item) => (
                                <li key={item.lead} className="flex gap-2">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
                                    <span>
                                        <span className="font-semibold text-brand">
                                            {item.lead}
                                        </span>{" "}
                                        {item.body}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <p>
                            Experiments used two synthetic four class datasets: in Model 1 the class
                            centers sit along a diagonal line, and in Model 2 they sit in the four
                            quadrants.
                        </p>
                    </ReportSection>

                    <ReportSection title="Results">
                        <ReportTable
                            caption="Multiclass classifier: accuracy by training set size n"
                            headers={["n", "Train M1", "Train M2", "Test M1", "Test M2"]}
                            rows={[
                                ["16", "0.9250", "0.9938", "0.7325", "0.8579"],
                                ["32", "0.8844", "0.9844", "0.7940", "0.8903"],
                                ["64", "0.8625", "0.9578", "0.8246", "0.8940"],
                                ["128", "0.8594", "0.9383", "0.8327", "0.9174"],
                            ]}
                            highlightRow={3}
                            note="More training data narrows the gap between training and test accuracy: test accuracy climbs from 73% to 83% on Model 1 and from 86% to 92% on Model 2."
                        />

                        <ReportTable
                            caption="PCA: accuracy after projecting to k dimensions"
                            headers={["Dimensions k", "Train M1", "Train M2", "Test M1", "Test M2"]}
                            rows={[
                                ["1", "0.8545", "0.6509", "0.8437", "0.6272"],
                                ["2", "0.8538", "0.9412", "0.8375", "0.9169"],
                            ]}
                            note="One principal component is enough for Model 1, whose classes lie along a single direction. Model 2 needs both: dropping to one dimension costs about 30 points of accuracy."
                        />

                        <ReportLineChart
                            caption="k-means: objective value for each number of clusters"
                            xLabel="number of clusters k"
                            yLabel="objective value"
                            points={[
                                [2, 2.4035],
                                [3, 1.4847],
                                [4, 0.9016],
                                [5, 0.7399],
                                [6, 0.6147],
                                [7, 0.5087],
                                [8, 0.4415],
                                [9, 0.3931],
                            ]}
                            marked={4}
                            note="The objective always falls as k grows, so we looked for the elbow: big drops from 2 to 3 and 3 to 4, then gains under 0.2 per extra cluster. We chose k = 4."
                        />
                    </ReportSection>

                    <ReportSection title="What We Learned">
                        <ul className="flex flex-col gap-2">
                            {[
                                "Whether dimensionality reduction helps depends entirely on the shape of the data, not on a rule of thumb.",
                                "PCA also acts as a regularizer: training and test accuracy stayed within 1 to 3 points of each other after projection.",
                                "Adding clusters always lowers the k-means objective, so the number of clusters has to be read from how fast the objective improves, not from its value.",
                            ].map((item) => (
                                <li key={item} className="flex gap-2">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p>
                            Completed as a pair assignment with a teammate. The code stays private
                            since it is graded coursework.
                        </p>
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
