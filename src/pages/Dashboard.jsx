import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import TransactionForm from '../components/TransactionForm'
import TransactionList from '../components/TransactionList'
import CashFlowSummary from '../components/CashFlowSummary'
import UpgradeButton from '../components/UpgradeButton'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const loadTransactions = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('occurred_on', { ascending: false })

    if (!error) setTransactions(data)
    setLoading(false)
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  const addTransaction = async (transaction) => {
    const { error } = await supabase
      .from('transactions')
      .insert({ ...transaction, user_id: user.id })

    if (!error) loadTransactions()
  }

  const deleteTransaction = async (id) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (!error) loadTransactions()
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Cash Flow Tracker</h1>
        <div className="header-actions">
          <UpgradeButton />
          <button onClick={signOut} className="link-button">Log out</button>
        </div>
      </header>

      <CashFlowSummary transactions={transactions} />

      <TransactionForm onAdd={addTransaction} />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <TransactionList transactions={transactions} onDelete={deleteTransaction} />
      )}
    </div>
  )
}
