import nrql from './nrql';

describe('nrql util', () => {
  test('renders color coded html', () => {
    const query = `SELECT count(*) FROM transaction WHERE country = 'us'`;
    const html = nrql.lexer(query);
    let match = `<span class=\"keyword\">SELECT</span> `;
    match += `<span class=\"function\">count</span>(*) `;
    match += `<span class=\"keyword\">FROM</span> `;
    match += `transaction `;
    match += `<span class=\"keyword\">WHERE</span> `;
    match += `country `;
    match += `<span class=\"operator\">=</span> `;
    match += `<span class=\"string\">'us'</span>`;
    expect(html).toBe(match);
  });
});
