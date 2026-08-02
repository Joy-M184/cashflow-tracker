import { useState } from 'react'

export default function TransactionForm({ onAdd }) {
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [occurredOn, setOccurredOn] = useState(new Date().toISOString().slice(0, 10))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount) return

    onAdd({
      amount: parseFloat(amount),
      type,
      category: category || null,
      description: description || null,
      occurred_on: occurredOn,
    })

    setAmount('')
    setCategory('')
    setDescription('')
  }

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <input
        type="number"
        step="0.01"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Category (optional)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="date"
        value={occurredOn}
        onChange={(e) => setOccurredOn(e.target.value)}
      />

      <button type="submit">Add</button>
    </form>
  )
}
