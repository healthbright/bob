import { Scale, Package, Wrench, Search, TestTube, Globe, Cpu } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

interface Dependency {
  name: string;
  purpose: string;
  license: string;
  licenseUrl: string;
  repository: string;
}

const prerequisites: Dependency[] = [
  {
    name: "Homebrew",
    purpose: "Package manager (macOS/Linux)",
    license: "BSD-2-Clause",
    licenseUrl: "https://opensource.org/licenses/BSD-2-Clause",
    repository: "https://github.com/Homebrew/brew",
  },
  {
    name: "Git",
    purpose: "Version control",
    license: "GPL-2.0",
    licenseUrl: "https://opensource.org/licenses/GPL-2.0",
    repository: "https://github.com/git/git",
  },
  {
    name: "GitHub CLI",
    purpose: "GitHub operations from the terminal",
    license: "MIT",
    licenseUrl: "https://opensource.org/licenses/MIT",
    repository: "https://github.com/cli/cli",
  },
  {
    name: "Python 3.12",
    purpose: "Programming language runtime",
    license: "PSF-2.0",
    licenseUrl: "https://docs.python.org/3/license.html",
    repository: "https://github.com/python/cpython",
  },
  {
    name: "Node.js 22",
    purpose: "JavaScript runtime",
    license: "MIT",
    licenseUrl: "https://opensource.org/licenses/MIT",
    repository: "https://github.com/nodejs/node",
  },
  {
    name: "NVM",
    purpose: "Node.js version manager",
    license: "MIT",
    licenseUrl: "https://opensource.org/licenses/MIT",
    repository: "https://github.com/nvm-sh/nvm",
  },
  {
    name: "pnpm",
    purpose: "Fast Node.js package manager",
    license: "MIT",
    licenseUrl: "https://opensource.org/licenses/MIT",
    repository: "https://github.com/pnpm/pnpm",
  },
  {
    name: "Bun",
    purpose: "JavaScript runtime and toolkit",
    license: "MIT",
    licenseUrl: "https://opensource.org/licenses/MIT",
    repository: "https://github.com/oven-sh/bun",
  },
  {
    name: "uv",
    purpose: "Python package manager",
    license: "MIT / Apache-2.0",
    licenseUrl: "https://github.com/astral-sh/uv/blob/main/LICENSE-MIT",
    repository: "https://github.com/astral-sh/uv",
  },
  {
    name: "Go",
    purpose: "Programming language runtime",
    license: "BSD-3-Clause",
    licenseUrl: "https://opensource.org/licenses/BSD-3-Clause",
    repository: "https://github.com/golang/go",
  },
  {
    name: "gopls",
    purpose: "Go language server",
    license: "BSD-3-Clause",
    licenseUrl: "https://opensource.org/licenses/BSD-3-Clause",
    repository: "https://github.com/golang/tools",
  },
  {
    name: "ripgrep",
    purpose: "Fast text search",
    license: "Unlicense / MIT",
    licenseUrl: "https://github.com/BurntSushi/ripgrep/blob/master/LICENSE-MIT",
    repository: "https://github.com/BurntSushi/ripgrep",
  },
];

const devTools: Dependency[] = [
  {
    name: "Ruff",
    purpose: "Python linter and formatter",
    license: "MIT",
    licenseUrl: "https://opensource.org/licenses/MIT",
    repository: "https://github.com/astral-sh/ruff",
  },
  {
    name: "basedpyright",
    purpose: "Python type checker",
    license: "MIT",
    licenseUrl: "https://opensource.org/licenses/MIT",
    repository: "https://github.com/DetachHead/basedpyright",
  },
  {
    name: "Prettier",
    purpose: "Code formatter (JS/TS/CSS/HTML)",
    license: "MIT",
    licenseUrl: "https://opensource.org/licenses/MIT",
    repository: "https://github.com/prettier/prettier",
  },
  {
    name: "TypeScript",
    purpose: "TypeScript compiler",
    license: "Apache-2.0",
    licenseUrl: "https://opensource.org/licenses/Apache-2.0",
    repository: "https://github.com/microsoft/TypeScript",
  },
  {
    name: "golangci-lint",
    purpose: "Go linter aggregator",
    license: "GPL-3.0",
    licenseUrl: "https://opensource.org/licenses/GPL-3.0",
    repository: "https://github.com/golangci/golangci-lint",
  },
  {
    name: "vtsls",
    purpose: "TypeScript language server",
    license: "MIT",
    licenseUrl: "https://opensource.org/licenses/MIT",
    repository: "https://github.com/yioneko/vtsls",
  },
];

const searchAndAnalysis: Dependency[] = [
  {
    name: "Probe",
    purpose: "Semantic code search engine",
    license: "ISC",
    licenseUrl: "https://opensource.org/licenses/ISC",
    repository: "https://github.com/probelabs/probe",
  },
  {
    name: "ccusage",
    purpose: "Claude Code usage analytics",
    license: "MIT",
    licenseUrl: "https://opensource.org/licenses/MIT",
    repository: "https://github.com/ryoppippi/ccusage",
  },
  {
    name: "Skillshare",
    purpose: "AI skill sharing and sync",
    license: "MIT",
    licenseUrl: "https://opensource.org/licenses/MIT",
    repository: "https://github.com/runkids/skillshare",
  },
];

const pluginDeps: Dependency[] = [
  {
    name: "Transformers.js",
    purpose: "Local ML model inference for embeddings",
    license: "Apache-2.0",
    licenseUrl: "https://opensource.org/licenses/Apache-2.0",
    repository: "https://github.com/xenova/transformers.js",
  },
  {
    name: "sharp",
    purpose: "High-performance image processing",
    license: "Apache-2.0",
    licenseUrl: "https://opensource.org/licenses/Apache-2.0",
    repository: "https://github.com/lovell/sharp",
  },
];

const testingTools: Dependency[] = [
  {
    name: "Playwright CLI",
    purpose: "Browser automation and E2E testing",
    license: "Apache-2.0",
    licenseUrl: "https://opensource.org/licenses/Apache-2.0",
    repository: "https://github.com/nicepkg/playwright-cli",
  },
  {
    name: "Chromium",
    purpose: "Headless browser engine (via Playwright)",
    license: "BSD-3-Clause",
    licenseUrl: "https://opensource.org/licenses/BSD-3-Clause",
    repository: "https://www.chromium.org/chromium-projects/",
  },
  {
    name: "hypothesis",
    purpose: "Property-based testing (Python)",
    license: "MPL-2.0",
    licenseUrl: "https://opensource.org/licenses/MPL-2.0",
    repository: "https://github.com/HypothesisWorks/hypothesis",
  },
  {
    name: "fast-check",
    purpose: "Property-based testing (TypeScript)",
    license: "MIT",
    licenseUrl: "https://opensource.org/licenses/MIT",
    repository: "https://github.com/dubzzz/fast-check",
  },
];

const mcpServers: Dependency[] = [
  {
    name: "Context7",
    purpose: "Library documentation lookup",
    license: "MIT",
    licenseUrl: "https://opensource.org/licenses/MIT",
    repository: "https://github.com/upstash/context7",
  },
  {
    name: "open-websearch",
    purpose: "Web search (multi-engine, no API key)",
    license: "MIT",
    licenseUrl: "https://opensource.org/licenses/MIT",
    repository: "https://github.com/Aas-ee/open-webSearch",
  },
  {
    name: "fetcher-mcp",
    purpose: "Web page fetching via Playwright",
    license: "MIT",
    licenseUrl: "https://opensource.org/licenses/MIT",
    repository: "https://github.com/jae-jae/fetcher-mcp",
  },
];

const categoryIcon: Record<string, React.ReactNode> = {
  prerequisites: <Cpu className="h-3.5 w-3.5 text-primary" />,
  devTools: <Wrench className="h-3.5 w-3.5 text-primary" />,
  searchAndAnalysis: <Search className="h-3.5 w-3.5 text-primary" />,
  pluginDeps: <Package className="h-3.5 w-3.5 text-primary" />,
  testingTools: <TestTube className="h-3.5 w-3.5 text-primary" />,
  mcpServers: <Globe className="h-3.5 w-3.5 text-primary" />,
};

const categories = [
  {
    key: "prerequisites",
    title: "System Prerequisites",
    subtitle: "Installed via Homebrew (macOS) or system package manager (Linux)",
    items: prerequisites,
  },
  {
    key: "devTools",
    title: "Development Tools",
    subtitle: "Linters, formatters, type checkers, and language servers",
    items: devTools,
  },
  {
    key: "searchAndAnalysis",
    title: "Search & Utilities",
    subtitle: "Code search, usage analytics, and skill management",
    items: searchAndAnalysis,
  },
  {
    key: "pluginDeps",
    title: "Plugin Runtime Dependencies",
    subtitle: "npm packages used by Pilot Shell's memory and processing features",
    items: pluginDeps,
  },
  {
    key: "testingTools",
    title: "Testing Tools",
    subtitle: "Browser automation and property-based testing",
    items: testingTools,
  },
  {
    key: "mcpServers",
    title: "MCP Servers",
    subtitle: "Model Context Protocol servers pre-cached during install",
    items: mcpServers,
  },
];

const LicenseBadge = ({ license, url }: { license: string; url: string }) => {
  const colorMap: Record<string, string> = {
    MIT: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "Apache-2.0": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "BSD-2-Clause": "bg-sky-500/10 text-sky-400 border-sky-500/20",
    "BSD-3-Clause": "bg-sky-500/10 text-sky-400 border-sky-500/20",
    "GPL-2.0": "bg-orange-500/10 text-orange-400 border-orange-500/20",
    "GPL-3.0": "bg-orange-500/10 text-orange-400 border-orange-500/20",
    "MPL-2.0": "bg-violet-500/10 text-violet-400 border-violet-500/20",
    "PSF-2.0": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    ISC: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  const color =
    Object.entries(colorMap).find(([key]) => license.includes(key))?.[1] ??
    "bg-muted text-muted-foreground border-border/50";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border transition-opacity hover:opacity-80 ${color}`}
    >
      {license}
    </a>
  );
};

const DependencyTable = ({ items }: { items: Dependency[] }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-xs">
      <thead>
        <tr className="border-b border-border/50">
          <th className="text-left py-2 px-3 font-medium text-muted-foreground">
            Tool
          </th>
          <th className="text-left py-2 px-3 font-medium text-muted-foreground hidden sm:table-cell">
            Purpose
          </th>
          <th className="text-left py-2 px-3 font-medium text-muted-foreground">
            License
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((dep) => (
          <tr
            key={dep.name}
            className="border-b border-border/30 hover:bg-card/50 transition-colors"
          >
            <td className="py-2 px-3">
              <a
                href={dep.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {dep.name}
              </a>
              <p className="text-muted-foreground mt-0.5 sm:hidden">
                {dep.purpose}
              </p>
            </td>
            <td className="py-2 px-3 text-muted-foreground hidden sm:table-cell">
              {dep.purpose}
            </td>
            <td className="py-2 px-3">
              <LicenseBadge license={dep.license} url={dep.licenseUrl} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const OpenSourceSection = () => {
  const [ref, inView] = useInView<HTMLDivElement>();

  const totalDeps = categories.reduce((sum, c) => sum + c.items.length, 0);

  return (
    <section
      id="open-source"
      className="py-10 border-b border-border/50 scroll-mt-24"
    >
      <div ref={ref} className={inView ? "animate-fade-in-up" : "opacity-0"}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Scale className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Open Source Compliance
            </h2>
            <p className="text-sm text-muted-foreground">
              {totalDeps} open-source tools installed alongside Pilot Shell
            </p>
          </div>
        </div>

        <div className="rounded-xl p-4 border border-primary/20 bg-primary/5 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground text-sm">
              Third-Party Dependencies
            </h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Pilot Shell installs the following open-source tools during setup.
            Each tool is installed only if not already present on your system.
            All tools retain their original licenses and are not modified or
            redistributed by Pilot Shell.{" "}
            <span className="text-foreground font-medium">
              Claude Code
            </span>{" "}
            (proprietary, by Anthropic) is also installed automatically if
            missing — it is the foundation that Pilot Shell extends.
          </p>
        </div>

        <div className="space-y-6">
          {categories.map((category) => (
            <div
              key={category.key}
              className="rounded-xl border border-border/50 bg-card overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-border/50 bg-card/80">
                <div className="flex items-center gap-2">
                  {categoryIcon[category.key]}
                  <h3 className="font-semibold text-foreground text-sm">
                    {category.title}
                  </h3>
                  <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
                    {category.items.length}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 ml-5.5">
                  {category.subtitle}
                </p>
              </div>
              <DependencyTable items={category.items} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OpenSourceSection;
