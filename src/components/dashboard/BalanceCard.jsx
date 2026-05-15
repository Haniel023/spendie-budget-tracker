import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

function BalanceCard({ summary }) {
  return (
    <section className="balance-card">
      <div className="balance-top">
        <div>
          <p>Total Balance</p>
          <h2>₱{(summary.balance ?? 0).toFixed(2)}</h2>
        </div>

        <div className="wallet-icon">
          <Wallet size={28} />
        </div>
      </div>

      <div className="balance-stats">
        <div>
          <span className="stat-icon income">
            <TrendingUp size={16} />
          </span>
          <p>Income</p>
          <strong>₱{(summary.income ?? 0).toFixed(2)}</strong>
        </div>

        <div>
          <span className="stat-icon expense">
            <TrendingDown size={16} />
          </span>
          <p>Expenses</p>
          <strong>₱{(summary.expenses ?? 0).toFixed(2)}</strong>
        </div>
      </div>
    </section>
  );
}

export default BalanceCard;