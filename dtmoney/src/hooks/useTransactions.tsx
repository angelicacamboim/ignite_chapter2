import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState
} from 'react'
import { api } from '../services/api'

interface Transaction {
	id: number
	title: string
	amount: number
	type: string
	category: string
	createdAt: string
}

interface TransactionInput {
	title: string
	amount: number
	type: string
	category: string
}

// type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>
// type TransactionInput = Pick<Transaction, 'title' | 'amount' | 'type' | 'category'>

interface TransactionsProviderProps {
	children: ReactNode //jsx
}

interface TransactionsContextData {
	transactions: Transaction[]
	createTransaction: (transaction: TransactionInput) => Promise<void>
}

//criação do contexto
const TransactionsContext = createContext<TransactionsContextData>(
	{} as TransactionsContextData
)

export function TransactionsProvider({ children }: TransactionsProviderProps) {
	const [transactions, setTransactions] = useState<Transaction[]>([])

	useEffect(() => {
		api
			.get('transactions')
			.then((response) => setTransactions(response.data.transactions))
	}, [])

	async function createTransaction(transactionInput: TransactionInput) {
		const response = await api.post('/transactions', {
			...transactionInput,
			createdAt: new Date()
		})
		const { transaction } = response.data
		setTransactions([...transactions, transaction])
	}

	return (
		<TransactionsContext.Provider value={{ transactions, createTransaction }}>
			{children}
		</TransactionsContext.Provider>
	)
}

//use context para ser usado nos componentes que usam esse contexto
export function useTransactions() {
	const context = useContext(TransactionsContext)

	return context
}
