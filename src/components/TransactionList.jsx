export default function TransactionList({ transactions, onDelete }) {
  if (transactions.length === 0) {
    return <p className="empty-state">No transactions yet. Add your first one above.</p>
  }

  return (
    <table className="transaction-list">
      <thead>
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Category</th>
          <th>Description</th>
          <th>Amount</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t) => (
          <tr key={t.id}>
            <td>{t.occurred_on}</td>
            <td className={t.type}>{t.type}</td>
            <td>{t.category || '—'}</td>
            <td>{t.description || '—'}</td>
            <td className={t.type}>
              {t.type === 'income' ? '+' : '-'}£{Number(t.amount).toFixed(2)}
            </td>
            <td>
              <button className="link-button" onClick={() => onDelete(t.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
