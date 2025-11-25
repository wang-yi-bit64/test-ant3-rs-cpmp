# 项目规则（Trae Rules）

本文档用于指导在本仓库中进行开发、修改、测试与交付的统一约定。面向 Trae IDE 智能助手与人类协作开发者，帮助在保持一致的技术栈与风格的前提下高效产出。

## 技术栈与约束
- 前端：`react@16.14`（兼容 React 17 Hooks 用法）、`antd@3.26.20`
- 构建与开发：`@rsbuild/core`（命令：`dev`/`build`/`preview`）
- 测试：`jest@27`、`@testing-library/react`（JS/JSX 测试）
- 代码质量：`@biomejs/biome`（命令：`check`/`format`）
- 类型：项目默认 JS 代码，若需 TS 暴露类型，请提供 `index.d.ts`

## 统一工作流
1. 需求拆解：使用任务清单进行规划与跟踪（创建、标注 `in_progress`、完成后立即标注 `completed`）。
2. 检索与理解：优先使用代码检索功能进行广义与多轮查询；读取相关文件、理解现有风格与目录结构。
3. 实施变更：
   - 首选更新已有文件；只有必要时才创建新文件。
   - 使用安全的补丁方式进行文件修改；避免直接使用 shell 创建/写入文件。
4. 校验与优化：
   - 运行代码质量与测试命令，保证变更可运行、风格一致、测试通过。
   - 进行无障碍（WCAG）与性能检查，避免不必要的渲染与重排。
5. 交付与说明：提供代码、样式、测试、示例与文档更新；说明关键设计与兼容性点。

## 可执行命令（在仓库根目录）
- 开发：`pnpm run dev`（启动开发服务器并自动打开浏览器）
- 构建：`pnpm run build`
- 预览：`pnpm run preview`
- 测试：`pnpm run test`、`pnpm run test:watch`、`pnpm run test:coverage`
- 代码检查：`pnpm run check`（Biome 语义检查并自动修复）
- 代码格式化：`pnpm run format`

> 规则：在完成任何非文档性质的代码改动后，至少运行 `pnpm run check` 与 `pnpm run test`。若缺少类型检查脚本，则通过保持 `.d.ts` 来提供类型消费能力。

## 目录与文件规范
- 组件目录：`src/components/<ComponentName>/`
  - 源码：`index.jsx`
  - 类型：`index.d.ts`（必要时）
  - 样式：`index.css`
  - 测试：`__tests__/<ComponentName>.test.jsx`
  - 示例：`demo.jsx`
  - 文档：`README.md`
- 页面示例：`src/pages/<FeaturePage>/index.jsx`
- 测试初始化：`src/setupTests.js`

## 代码风格与实现要求
- 保持与现有组件一致的风格：使用 AntD v3 组件与样式导入方式（`import "antd/lib/.../style/index.css"`）。
- Props：使用 `PropTypes` 定义必需与可选属性；若需 TS 使用者，提供对齐的 `index.d.ts`。
- 表单模式：支持 AntD v3 Form 的受控与非受控模式（`value`/`defaultValue`/`onChange`）。
- React Hooks：使用 `useState`、`useEffect`、`useMemo`、`useCallback`、`useRef` 等，确保 React 16/17 兼容。
- 无注释规则：除文档文件外，代码中避免额外注释；以清晰命名与结构自解释。

## 无障碍（WCAG）要求
- 输入容器使用合适的 ARIA 属性：`role="combobox"`、`aria-haspopup="grid"`、`aria-expanded`。
- 弹层使用 `role="dialog"` 或语义化容器与可聚焦元素；支持键盘导航（Esc 关闭、方向键导航、组合键切换视图）。
- 为动态元素提供状态文本或可达的标题；颜色对比度符合可读性要求。

## 性能优化准则
- 对重复渲染的 UI 使用 `useMemo`/`useCallback` 缓存；避免在渲染中创建大型对象或函数。
- 控制弹层与大列表渲染范围；在需要时进行虚拟化或延迟渲染。
- 事件与键盘监听在打开时注册，关闭时及时移除。

## 测试策略
- 单元测试覆盖核心交互：打开/关闭、选择、清空、禁用日期、受控值更新、快捷按钮等。
- 使用 `@testing-library/react` 与 `jest-dom` 断言语义与可见性；测试文件位于组件目录的 `__tests__/` 下。
- 覆盖率报告：`pnpm run test:coverage`，确保关键逻辑有断言。

## 组件开发范式（示例：日期选择器）
- 与 AntD v3 保持视觉与交互一致：按钮、选择框、阴影、圆角、焦点样式等。
- 选中模式：`single`/`range`/`multiple`；支持 `disabledDate`、`minDate`、`maxDate`。
- 时间选择：可选 `showTime` 与步进限制；12/24 小时格式映射。
- 键盘导航：对齐 Air Datepicker 文档中的组合键；支持视图切换。
- 自定义渲染：`onRenderCell` 支持自定义内容、类名与禁用；`buttons` 支持预设与自定义行为。
- 兼容性：在现代浏览器下工作；避免使用不受支持的 CSS/JS 特性。

## 变更与提交
- 仅在用户明确要求时进行提交；默认以提议的补丁形式展示改动。
- 在展示改动前，完成本规则中的质量检查与测试步骤。

## 常见问题
- 若需要 TypeScript 单元测试或 TS 构建，请在后续迭代引入相应工具链（如 `ts-jest` 或 Babel TypeScript 预设）；当前仓库默认以 JS 测试与 `.d.ts` 类型文件满足消费需求。
