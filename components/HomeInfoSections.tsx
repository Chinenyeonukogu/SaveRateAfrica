import { faqItems, howItWorksSteps } from "@/lib/site-data";

const pageShellClassName = "mx-auto w-full max-w-[1200px] px-6";
const postComparisonSectionInnerClassName = `${pageShellClassName} py-6 min-[600px]:py-8 lg:py-10`;
const sectionDividerClassName = "border-t border-[#e8f5e9]";

export function HomeInfoSections() {
  return (
    <>
      <section id="faq" className={sectionDividerClassName}>
        <div className={postComparisonSectionInnerClassName}>
          <section
            id="how-it-works"
            className="rounded-[16px] border border-[#c8e6c9] bg-white px-4 py-5 min-[600px]:px-6 min-[600px]:py-6 lg:px-8 lg:py-8"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">
              How it works
            </p>
            <h2 className="mb-4 mt-2 text-[28px] font-heading text-brand-navy min-[600px]:text-3xl">
              A clearer route from diaspora wallet to Nigerian bank account
            </h2>

            <div className="grid gap-4 lg:grid-cols-3 lg:gap-0">
              {howItWorksSteps.map((step, index) => (
                <article
                  key={step.step}
                  className={`relative lg:px-6 ${
                    index < howItWorksSteps.length - 1
                      ? "border-b border-[#e8f5e9] pb-4 lg:border-b-0"
                      : ""
                  } ${index > 0 ? "pt-4 lg:pt-0" : ""}`}
                >
                  {index < howItWorksSteps.length - 1 ? (
                    <span className="absolute right-0 top-3 hidden h-[52px] border-r border-[#c8e6c9] lg:block" />
                  ) : null}
                  <p className="mb-[10px] text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2e7d32]">
                    Step {step.step}
                  </p>
                  <h3 className="mb-[6px] text-base font-heading text-brand-navy min-[600px]:text-lg">
                    {step.title}
                  </h3>
                  <p className="text-[12px] leading-6 text-brand-navy/70 min-[600px]:text-sm">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className={sectionDividerClassName}>
        <div className={postComparisonSectionInnerClassName}>
          <section className="rounded-[16px] border border-brand-navy/10 bg-white px-4 py-5 shadow-float min-[600px]:px-6 min-[600px]:py-6 lg:px-8 lg:py-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">
              FAQ
            </p>
            <h2 className="mb-4 mt-2 text-[28px] font-heading text-brand-navy min-[600px]:text-3xl">
              Questions Nigerian diaspora senders ask most
            </h2>

            <div className="space-y-4">
              {faqItems.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-[16px] bg-brand-light p-4 min-[600px]:p-5"
                >
                  <summary className="cursor-pointer list-none text-[14px] font-semibold text-brand-navy min-[600px]:text-base">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-[12px] leading-6 text-brand-navy/70 min-[600px]:text-sm min-[600px]:leading-7">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
