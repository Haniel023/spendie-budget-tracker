function TopCategories({
  transactions,
}) {
  const categoryTotals = {};

  transactions
    .filter(
      (item) =>
        item.type === "expense"
    )
    .forEach((item) => {
      categoryTotals[
        item.category
      ] =
        (categoryTotals[
          item.category
        ] || 0) +
        Number(item.amount);
    });

  const categories =
    Object.entries(
      categoryTotals
    ).sort(
      (a, b) => b[1] - a[1]
    );

  const highest =
    categories[0]?.[1] || 1;

  return (
    <section className="section-card">
      <div className="section-header">
        <div>
          <h2>
            Top Categories
          </h2>

          <p>
            Where your money goes
          </p>
        </div>
      </div>

      <div className="top-category-list">
        {categories.map(
          ([category, amount]) => (
            <div
              key={category}
              className="top-category-item"
            >
              <div className="top-category-row">
                <strong>
                  {category}
                </strong>

                <span>
                  ₱
                  {amount.toFixed(
                    2
                  )}
                </span>
              </div>

              <div className="top-category-bar">
                <div
                  className="top-category-fill"
                  style={{
                    width: `${
                      (amount /
                        highest) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}

export default TopCategories;