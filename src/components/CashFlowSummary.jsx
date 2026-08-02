export default function CashFlowSummary({ transactions }) {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const net = income - expenses

  const insight = getInsight(income, expenses, net)

  return (
    <div className="summary-cards">
      <div className="summary-card">
        <span className="label">Income</span>
        <span className="value income">£{income.toFixed(2)}</span>
      </div>
      <div className="summary-card">
        <span className="label">Expenses</span>
        <span className="value expense">£{expenses.toFixed(2)}</span>
      </div>
      <div className="summary-card">
        <span className="label">Net</span>
        <span className={`value ${net >= 0 ? 'income' : 'expense'}`}>
          £{net.toFixed(2)}
        </span>
      </div>
      <div className="summary-card insight">
        <span className="label">Insight</span>
        <span className="value">{insight}</span>
      </div>
    </div>
  )
}

// Simple rule-based insight for now. Swap this out for a call to a
// serverless function that hits the Anthropic API for real AI-generated
// insights once you're ready to wire that up (see README).
function getInsight(income, expenses, net) {
  if (income === 0 && expenses === 0) return 'Add some transactions to see insights.'
  if (net < 0) return 'You are spending more than you are earning this period.'
  if (expenses > income * 0.8) return 'Expenses are close to your income. Consider trimming.'
  return 'Your cash flow looks healthy this period.'
}
