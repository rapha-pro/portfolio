import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { PROJECTS } from "@/lib/data/projects"
import { TechBadge } from "@/components/projects/tech-badge"
import { AccuracyHeatmap, ReportSection, ReportTable } from "@/components/projects/report-blocks"

const project = PROJECTS.find((p) => p.slug === "kernel-svms-a2")!

/**
 * Purpose:
 *   Custom detail page for COMP 3105 Assignment 2, kernel SVMs built from
 *   scratch. Explains why kernels matter, the three formulations we wrote,
 *   and reproduces the result tables from the report.
 *
 * Returns:
 *   Full project detail page with hero image, structured sections, result
 *   tables, the MNIST cross validation heatmap, and tech stack.
 */
export default function KernelSvmsPage() {
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
                            Support vector machines are one of the most important classical
                            classifiers, and kernels are what let a linear method learn curved
                            decision boundaries without ever computing the curved features directly.
                            Calling a library hides all of that. In this assignment we built binary
                            SVM classifiers from scratch in NumPy, writing every objective,
                            constraint matrix, and kernel by hand. CVXOPT was used only as the
                            quadratic program solver and SciPy only for unconstrained minimization,
                            with no scikit-learn anywhere.
                        </p>
                    </ReportSection>

                    <ReportSection title="What We Built">
                        <ul className="flex flex-col gap-3">
                            {[
                                {
                                    lead: "Primal form.",
                                    body: "A linear classifier with L2 regularization, trained two ways: the hinge loss written as a quadratic program for CVXOPT, and the smooth ExpLinear loss minimized directly with SciPy.",
                                },
                                {
                                    lead: "Adjoint form.",
                                    body: "The same two losses rewritten in terms of the training points, so any kernel can be plugged in: linear, polynomial of degree 2 and 3, and Gaussian of several widths.",
                                },
                                {
                                    lead: "Dual form.",
                                    body: "The classic SVM dual with the hinge loss, solved as a quadratic program over the kernel matrix, with its own classifier for new points.",
                                },
                                {
                                    lead: "Model selection.",
                                    body: "5 fold cross validation over the regularization strength λ and seven kernels, run on handwritten 4s and 9s from MNIST.",
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
                            The synthetic tests used three datasets of increasing difficulty: Model
                            1 is linearly separable, Model 2 needs an oval boundary, and Model 3 is
                            two interleaving moons.
                        </p>
                    </ReportSection>

                    <ReportSection title="Results">
                        <ReportTable
                            caption="Test accuracy by kernel (adjoint form)"
                            headers={[
                                "Kernel",
                                "ExpLinear M1",
                                "ExpLinear M2",
                                "ExpLinear M3",
                                "Hinge M1",
                                "Hinge M2",
                                "Hinge M3",
                            ]}
                            rows={[
                                [
                                    "Linear",
                                    "0.9889",
                                    "0.5695",
                                    "0.8840",
                                    "0.9863",
                                    "0.6034",
                                    "0.8802",
                                ],
                                [
                                    "Poly (d = 2)",
                                    "0.9859",
                                    "0.9795",
                                    "0.8826",
                                    "0.9831",
                                    "0.9713",
                                    "0.8793",
                                ],
                                [
                                    "Poly (d = 3)",
                                    "0.9751",
                                    "0.9638",
                                    "0.9929",
                                    "0.9699",
                                    "0.9600",
                                    "0.9862",
                                ],
                                [
                                    "Gauss (σ = 1)",
                                    "0.9723",
                                    "0.9672",
                                    "0.9977",
                                    "0.9637",
                                    "0.9657",
                                    "0.9946",
                                ],
                                [
                                    "Gauss (σ = 0.5)",
                                    "0.9587",
                                    "0.9625",
                                    "0.9982",
                                    "0.9596",
                                    "0.9588",
                                    "0.9981",
                                ],
                            ]}
                            note="A linear boundary is close to guessing on the oval dataset (57% to 60%), while polynomial and Gaussian kernels lift it to about 96% to 98%."
                        />

                        <ReportTable
                            caption="Best kernel and loss for each dataset"
                            headers={["Dataset", "Best kernel", "Best loss", "Test accuracy"]}
                            rows={[
                                ["Model 1 (linear)", "Linear", "ExpLinear", "0.989"],
                                ["Model 2 (oval)", "Poly (d = 2)", "ExpLinear", "0.979"],
                                ["Model 3 (moons)", "Gauss (σ = 0.5)", "Hinge", "0.998"],
                            ]}
                        />

                        <AccuracyHeatmap
                            caption="MNIST 4 vs 9: 5 fold cross validated accuracy (dual form)"
                            rowLabel="λ"
                            rows={["0.001", "0.01", "0.1", "1", "10"]}
                            cols={[
                                "Linear",
                                "Poly 2",
                                "Poly 3",
                                "Gauss 1",
                                "Gauss 3",
                                "Gauss 5",
                                "Gauss 8",
                            ]}
                            values={[
                                [0.958, 0.976, 0.974, 0.468, 0.972, 0.979, 0.974],
                                [0.958, 0.976, 0.974, 0.468, 0.972, 0.979, 0.974],
                                [0.958, 0.975, 0.975, 0.468, 0.972, 0.979, 0.977],
                                [0.958, 0.975, 0.975, 0.464, 0.97, 0.979, 0.971],
                                [0.968, 0.975, 0.974, 0.462, 0.84, 0.947, 0.944],
                            ]}
                            best={[2, 5]}
                            note="We chose a Gaussian kernel with σ = 5 and λ = 0.1: it ties for the best accuracy, 97.9%, while keeping enough regularization to avoid overfitting to unusual samples."
                        />
                    </ReportSection>

                    <ReportSection title="What We Learned">
                        <ul className="flex flex-col gap-2">
                            {[
                                "The kernel matters far more than the loss: ExpLinear and hinge stayed within about 3 points of each other everywhere, while switching kernels moved accuracy by as much as 41 points.",
                                "Match the kernel to the data. The linear kernel won on linearly separable data, and Gaussian kernels won on the moons, reaching 99.8% test accuracy.",
                                "Flexible kernels overfit. A narrow Gaussian (σ = 0.5) hit 100% training accuracy on every dataset but lost up to 4.1 points on the test set.",
                                "On clean data, more regularization is not free: raising λ slightly lowered accuracy, because there was little noise to protect against.",
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
