import { request } from '../core/http.js';

export async function checkGetFormReflection(form, timeoutMs = 6000) {
  if (form.method !== 'GET' || !form.inputs.length) return [];
  const url = new URL(form.action);
  const marker = `SG_REFLECT_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  for (const input of form.inputs) {
    url.searchParams.set(input.name, marker);
    try {
      const response = await request(url, { timeoutMs });
      if (response.text.includes(marker)) return [{
        severity: 'MEDIUM', category: 'reflection', title: 'User-controlled input reflected in response',
        evidence: `${form.action} ? ${input.name}=<marker>`,
        note: 'Reflection is not proof of XSS; review output encoding and context.'
      }];
    } catch {}
    finally { url.searchParams.delete(input.name); }
  }
  return [];
}
