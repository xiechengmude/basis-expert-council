"use client";

import { MarkdownContent } from "@/app/components/MarkdownContent";

const TEST_CONTENT = `
## LaTeX 数学公式渲染测试

### 行内公式

二次方程 $ax^2 + bx + c = 0$ 的求根公式为 $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$。

其中判别式 $\\Delta = b^2 - 4ac$ 决定了根的性质。

### 块级公式

欧拉公式：

$$e^{i\\pi} + 1 = 0$$

定积分：

$$\\int_0^1 x^2 \\, dx = \\frac{1}{3}$$

矩阵：

$$A = \\begin{pmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{pmatrix}$$

求和：

$$\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$$

### 混合内容

当 $f(x) = x^3 - 3x + 1$ 时，$f'(x) = 3x^2 - 3$，令 $f'(x) = 0$ 得 $x = \\pm 1$。

| 区间 | $f'(x)$ 符号 | $f(x)$ 单调性 |
|------|-------------|---------------|
| $(-\\infty, -1)$ | $+$ | 递增 |
| $(-1, 1)$ | $-$ | 递减 |
| $(1, +\\infty)$ | $+$ | 递增 |

### AP Calculus 示例题

Find the derivative of $f(x) = \\ln(\\sin(x^2))$.

$$f'(x) = \\frac{1}{\\sin(x^2)} \\cdot \\cos(x^2) \\cdot 2x = \\frac{2x\\cos(x^2)}{\\sin(x^2)}$$
`;

export default function LatexTestPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold text-white">LaTeX + Markdown 渲染测试</h1>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-slate-200">
          <MarkdownContent content={TEST_CONTENT} />
        </div>
      </div>
    </div>
  );
}
