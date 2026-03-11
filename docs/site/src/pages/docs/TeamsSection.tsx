import { Share2, CheckCircle2, ExternalLink } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

const DOCS_BASE = "https://skillshare.runkids.cc/docs/how-to/sharing";

const tiers = [
  {
    title: "Global Mode",
    badge: "Solo+",
    items: [
      "Install skills from GitHub URLs",
      "Sync skills to ~/.claude/skills/",
      "Cross-machine sync via git push/pull",
    ],
  },
  {
    title: "Project Mode",
    badge: "All plans",
    items: [
      "Commit skills to repo for team sharing",
      "New members get skills on git clone",
      "Separate from global skills — no conflicts",
    ],
  },
  {
    title: "Organization Hub",
    badge: "Team",
    items: [
      "Tracked repos for org-wide distribution",
      "Hub index — curated skill catalogs",
      "One command for team onboarding",
    ],
  },
];

const docLinks = [
  { href: `${DOCS_BASE}/project-setup`, title: "Project Setup", desc: "Commit skills to your repo" },
  { href: `${DOCS_BASE}/cross-machine-sync`, title: "Cross-Machine Sync", desc: "Sync via git push/pull" },
  { href: `${DOCS_BASE}/organization-sharing`, title: "Organization Sharing", desc: "Tracked repos for teams" },
  { href: `${DOCS_BASE}/hub-index`, title: "Hub Index Guide", desc: "Build a skill catalog" },
];

const ShareSection = () => {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <section
      id="share"
      className="py-10 border-b border-border/50 scroll-mt-24"
    >
      <div ref={ref} className={inView ? "animate-fade-in-up" : "opacity-0"}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Share2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Skill Sharing
            </h2>
            <p className="text-sm text-muted-foreground">
              Share skills across machines and teams — from personal sync to org-wide hubs
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
          The Share page in the Pilot Console manages skills using{" "}
          <a href="https://github.com/runkids/skillshare" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Skillshare
          </a>
          . Three modes cover different scopes: <strong>Global</strong> for personal cross-machine sync,{" "}
          <strong>Project</strong> for team-shared skills committed to the repo, and{" "}
          <strong>Organization</strong> for tracked repos and hub-based distribution. Only skills are shared
          — rules, commands, and agents stay project-specific.
        </p>

        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          {tiers.map((tier) => (
            <div
              key={tier.title}
              className="rounded-xl p-4 border border-border/50 bg-card"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground text-sm">{tier.title}</h3>
                <span className="text-xs font-medium text-primary bg-primary/10 rounded px-1.5 py-0.5">
                  {tier.badge}
                </span>
              </div>
              <ul className="space-y-1">
                {tier.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3 w-3 text-primary flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h3 className="font-semibold text-foreground text-sm mb-2">Setup</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Skillshare is installed automatically by the Pilot installer. Open the Console
          dashboard and navigate to the <strong>Share</strong> page to manage skills.
          The page shows your current mode (Global or Project), synced skills, git remote status,
          and documentation links.
        </p>
        <div className="bg-background/80 rounded-lg p-3 font-mono text-xs border border-border/50 text-muted-foreground mb-5">
          <div className="text-muted-foreground/60 mb-1"># Cross-machine sync (Global mode)</div>
          <div>
            <span className="text-primary">$</span> skillshare init --remote git@github.com:you/my-skills.git
          </div>
          <div className="text-muted-foreground/60 mt-2 mb-1"># Project mode — team sharing via git</div>
          <div>
            <span className="text-primary">$</span> skillshare init -p --targets claude
          </div>
          <div className="text-muted-foreground/60 mt-2 mb-1"># Organization hub (Team plan)</div>
          <div>
            <span className="text-primary">$</span> skillshare install github.com/org/skills --track
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-5">
          <div className="rounded-xl p-4 border border-primary/30 bg-primary/5">
            <h4 className="font-medium text-foreground text-sm mb-1">
              Project mode
              <span className="text-xs text-primary font-medium ml-2">All plans</span>
            </h4>
            <p className="text-xs text-muted-foreground">
              Commit <code className="text-primary">.skillshare/skills/</code> to your repo.
              New team members get all skills on clone — no extra setup.
            </p>
          </div>
          <div className="rounded-xl p-4 border border-border/50 bg-card">
            <h4 className="font-medium text-foreground text-sm mb-1">Organization hub</h4>
            <p className="text-xs text-muted-foreground">
              Track shared repos for org-wide distribution. Build a hub index
              for searchable skill catalogs.
            </p>
          </div>
        </div>

        <h3 className="font-semibold text-foreground text-sm mb-2">Documentation</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {docLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors group text-xs"
            >
              <ExternalLink className="h-3 w-3 text-primary flex-shrink-0" />
              <span className="font-medium text-foreground group-hover:text-primary transition-colors">{link.title}</span>
              <span className="text-muted-foreground">— {link.desc}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShareSection;
