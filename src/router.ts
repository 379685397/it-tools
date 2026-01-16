import { createRouter, createWebHistory } from 'vue-router';
import { layouts } from './layouts/index';
import HomePage from './pages/Home.page.vue';
import NotFound from './pages/404.page.vue';
import ToolUnavailablePage from './pages/ToolUnavailable.page.vue';
import { tools } from './tools';
import { config } from './config';

const toolsRoutes = tools.map(({ path, name, component, ...config }) => ({
  path,
  name,
  component,
  meta: { isTool: true, layout: layouts.toolLayout, name, ...config },
}));
const toolsRedirectRoutes = tools
  .filter(({ redirectFrom }) => redirectFrom && redirectFrom.length > 0)
  .flatMap(
    ({ path, redirectFrom }) => redirectFrom?.map(redirectSource => ({ path: redirectSource, redirect: path })) ?? [],
  );

const router = createRouter({
  history: createWebHistory(config.app.baseUrl),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./pages/About.vue'),
    },
    {
      path: '/tool-unavailable',
      name: 'tool-unavailable',
      component: ToolUnavailablePage,
    },
    ...toolsRoutes,
    ...toolsRedirectRoutes,
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  ],
});

function reportToolUsage(toolId: string) {
  try {
    void fetch('/api/tool-usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toolId }),
      keepalive: true,
    });
  }
  catch {
  }
}

function recordRecentToolId(toolId: string) {
  try {
    const raw = localStorage.getItem('recent-tool-ids');
    const current = raw ? JSON.parse(raw) : [];
    const ids = Array.isArray(current) ? current.filter(v => typeof v === 'string') : [];
    const next = [toolId, ...ids.filter(id => id !== toolId)].slice(0, 5);
    localStorage.setItem('recent-tool-ids', JSON.stringify(next));
  }
  catch {
  }
}

router.afterEach((to, from) => {
  if (to.meta?.isTool !== true) {
    return;
  }
  if (to.path === from.path) {
    return;
  }

  const toolId = typeof to.meta?.id === 'string' && to.meta.id.length > 0
    ? to.meta.id
    : String(to.path).replace(/^\//, '');
  if (!toolId) {
    return;
  }

  reportToolUsage(toolId);
  recordRecentToolId(toolId);
});

export default router;
