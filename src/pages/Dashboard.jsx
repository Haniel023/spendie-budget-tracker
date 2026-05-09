import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { LogOut, Plus } from "lucide-react";

import { categoryConfig } from "../lib/categoryConfig";
import { generateSmartAlerts } from "../lib/alertsEngine";
import { processRecurringTransactions } from "../lib/recurringEngine";
import { generateInsights } from "../lib/insightsEngine";
import { createNotification } from "../lib/notificationEngine";

import Header from "../components/common/Header";
import BottomNavigation from "../components/common/BottomNavigation";
import AppLoader from "../components/common/AppLoader";

import BalanceCard from "../components/dashboard/BalanceCard";
import AlertSection from "../components/dashboard/AlertSection";
import SpacesSection from "../components/dashboard/SpacesSection";
import MembersSection from "../components/dashboard/MembersSection";
import AnalyticsSection from "../components/dashboard/AnalyticsSection";
import BudgetSection from "../components/dashboard/BudgetSection";
import TransactionsSection from "../components/dashboard/TransactionsSection";
import QuickInfoSection from "../components/dashboard/QuickInfoSection";
import GoalsSection from "../components/dashboard/GoalsSection";
import InsightsSection from "../components/dashboard/InsightsSection";
import OverviewStats from "../components/dashboard/OverviewStats";
import RecentActivity from "../components/dashboard/RecentActivity";
import MonthlyTrendChart from "../components/dashboard/MonthlyTrendChart";

import TransactionModal from "../components/modals/TransactionModal";
import BudgetModal from "../components/modals/BudgetModal";
import InviteModal from "../components/modals/InviteModal";
import SpaceModal from "../components/modals/SpaceModal";
import RecurringModal from "../components/modals/RecurringModal";
import GoalModal from "../components/modals/GoalModal";

import FloatingAddButton from "../components/common/FloatingAddButton";


function Dashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [spaces, setSpaces] = useState([]);
    const [activeSpace, setActiveSpace] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const [transactionForm, setTransactionForm] = useState({
        type: "expense",
        amount: "",
        category: "",
        description: "",
    });

    const [summary, setSummary] = useState({
        income: 0,
        expenses: 0,
        balance: 0,
    });

    const [showSpaceModal, setShowSpaceModal] = useState(false);
    const [spaceName, setSpaceName] = useState("");

    const [members, setMembers] = useState([]);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");

    const [editingTransaction, setEditingTransaction] = useState(null);

    const [budgets, setBudgets] = useState([]);
    const [showBudgetModal, setShowBudgetModal] = useState(false);

    const [budgetForm, setBudgetForm] = useState({
        title: "",
        category: "",
        monthly_limit: "",
    });

    const [showRecurringModal, setShowRecurringModal] = useState(false);

    const [recurringForm, setRecurringForm] = useState({
        type: "expense",
        amount: "",
        category: "",
        description: "",
        frequency: "monthly",
        recurring_day_1: "",
        recurring_day_2: "",
    });

    const [alerts, setAlerts] = useState([]);
    const [darkMode, setDarkMode] = useState(false);
    const [goals, setGoals] = useState([]);

    const [showGoalModal, setShowGoalModal] =
        useState(false);

    const [goalForm, setGoalForm] = useState({
        title: "",
        target_amount: "",
        current_amount: "",
        deadline: "",
    });
    const [insights, setInsights] =
        useState([]);

    const [activeTab, setActiveTab] = useState("overview");
    const [notifications, setNotifications] =
        useState([]);

    const [showNotifications, setShowNotifications] =
        useState(false);

    const [spaceEmoji, setSpaceEmoji] =
        useState("💰");

    const [editingBudget, setEditingBudget] = useState(null);
    const [editingGoal, setEditingGoal] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    useEffect(() => {
        setAlerts(
            generateSmartAlerts({
                summary,
                budgets,
                transactions,
            })
        );
    }, [transactions, budgets, summary.balance]);

    useEffect(() => {
        setInsights(
            generateInsights({
                transactions,
                budgets,
                goals,
                summary,
            })
        );
    }, [
        transactions,
        budgets,
        goals,
        summary.balance,
    ]);

    useEffect(() => {
        if (!user) return;

        const channel = supabase
            .channel(`notifications-user-${user.id}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "notifications",
                    filter: `user_id=eq.${user.id}`,
                },
                () => {
                    loadNotifications(user.id);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    useEffect(() => {
        if (!activeSpace) return;

        const channel = supabase
            .channel(`transactions-space-${activeSpace.id}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "transactions",
                    filter: `space_id=eq.${activeSpace.id}`,
                },
                () => {
                    loadTransactions(activeSpace.id);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [activeSpace]);

    useEffect(() => {
        if (!user || budgets.length === 0 || transactions.length === 0) return;

        budgets.forEach(async (budget) => {
            const spent = transactions
                .filter(
                    (item) =>
                        item.type === "expense" &&
                        item.category === budget.category
                )
                .reduce((total, item) => total + Number(item.amount), 0);

            const limit = Number(budget.monthly_limit);

            if (spent > limit) {
                const message = `${budget.category} exceeded budget by ₱${(
                    spent - limit
                ).toFixed(2)}`;

                await notifyUser({
                    title: "Budget Exceeded",
                    message,
                    type: "danger",
                    dedupeKey: `budget-exceeded-${activeSpace?.id}-${budget.category}`,
                });
            }
        });
    }, [budgets, transactions, user, activeSpace]);

    useEffect(() => {
        if (!user) return;

        if (summary.balance > 0 && summary.balance < 1000) {
            notifyUser({
                title: "Low Balance",
                message: `Your balance is now ₱${summary.balance.toFixed(2)}.`,
                type: "warning",
                dedupeKey: `low-balance-${activeSpace?.id}`,
            });
        }
    }, [summary.balance, user, activeSpace]);

    useEffect(() => {
        if (!user || goals.length === 0)
            return;

        goals.forEach(async (goal) => {
            const percentage =
                (Number(
                    goal.current_amount
                ) /
                    Number(
                        goal.target_amount
                    )) *
                100;

            const milestones = [
                25, 50, 75, 100,
            ];

            for (const milestone of milestones) {
                if (percentage >= milestone) {
                    const message = `${goal.title} reached ${milestone}% completion.`;

                    const {
                        data: existing,
                    } = await supabase
                        .from("notifications")
                        .select("*")
                        .eq(
                            "user_id",
                            user.id
                        )
                        .eq(
                            "message",
                            message
                        )
                        .maybeSingle();

                    if (!existing) {
                        await notifyUser({
                            title:
                                "Goal Milestone",
                            message,
                            type: "goal",
                        });
                    }
                }
            }

            // COMPLETED GOAL
            if (percentage >= 100) {
                const completeMessage = `${goal.title} goal completed!`;

                const {
                    data: completedExisting,
                } = await supabase
                    .from("notifications")
                    .select("*")
                    .eq(
                        "user_id",
                        user.id
                    )
                    .eq(
                        "message",
                        completeMessage
                    )
                    .maybeSingle();

                if (
                    !completedExisting
                ) {
                    await notifyUser({
                        title:
                            "Goal Completed 🎉",
                        message:
                            completeMessage,
                        type: "success",
                    });
                }
            }
        });
    }, [goals, user]);

    const loadDashboard = async () => {
        const { data: authData } = await supabase.auth.getUser();

        if (!authData.user) {
            setPageLoading(false);
            navigate("/login");
            return;
        }

        setUser(authData.user);
        await cleanupOldNotifications(authData.user.id);
        loadNotifications(authData.user.id);

        const { data, error } = await supabase
            .from("space_members")
            .select(`
        space_id,
        spaces (
          id,
          name,
          type,
          emoji
        )
      `)
            .eq("user_id", authData.user.id);

        if (error) {
            console.log(error);
            return;
        }

        const formattedSpaces = data.map((item) => item.spaces);
        setSpaces(formattedSpaces);

        if (formattedSpaces.length > 0) {
            setActiveSpace(formattedSpaces[0]);

            await processRecurringTransactions({
                supabase,
                spaceId: formattedSpaces[0].id,
            });

            loadTransactions(formattedSpaces[0].id);
            loadMembers(formattedSpaces[0].id);
            loadBudgets(formattedSpaces[0].id);
            loadGoals(formattedSpaces[0].id);
        }
        setPageLoading(false);
    };

    const loadTransactions = async (spaceId) => {
        const { data, error } = await supabase
            .from("transactions")
            .select(`
        *,
        profiles (
          full_name,
          email
        )
      `)
            .eq("space_id", spaceId)
            .order("created_at", { ascending: false });

        if (error) {
            console.log(error);
            return;
        }

        setTransactions(data);

        const income = data
            .filter((item) => item.type === "income")
            .reduce((total, item) => total + Number(item.amount), 0);

        const expenses = data
            .filter((item) => item.type === "expense")
            .reduce((total, item) => total + Number(item.amount), 0);

        setSummary({
            income,
            expenses,
            balance: income - expenses,
        });
    };

    const loadMembers = async (spaceId) => {
        const { data, error } = await supabase
            .from("space_members")
            .select(`
        id,
        profiles (
          id,
          full_name,
          email
        )
      `)
            .eq("space_id", spaceId);

        if (error) {
            console.log(error);
            return;
        }

        setMembers(data);
    };

    const loadBudgets = async (spaceId) => {
        const { data, error } = await supabase
            .from("budgets")
            .select("*")
            .eq("space_id", spaceId);

        if (error) {
            console.log(error);
            return;
        }

        setBudgets(data);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    const handleAddTransaction = async (e) => {
        e.preventDefault();

        if (!activeSpace || !user) return;

        if (editingTransaction) {
            const { error } = await supabase
                .from("transactions")
                .update({
                    type: transactionForm.type,
                    amount: Number(transactionForm.amount),
                    category: transactionForm.category,
                    description: transactionForm.description,
                })
                .eq("id", editingTransaction.id);

            if (error) {
                console.log(error);
                return;
            }
        } else {
            const { error } = await supabase.from("transactions").insert([
                {
                    space_id: activeSpace.id,
                    created_by: user.id,
                    type: transactionForm.type,
                    amount: Number(transactionForm.amount),
                    category: transactionForm.category,
                    description: transactionForm.description,
                    emoji: spaceEmoji,
                },
            ]);

            if (error) {
                console.log(error);
                return;
            }
        }

        setTransactionForm({
            type: "expense",
            amount: "",
            category: "",
            description: "",
        });

        setEditingTransaction(null);
        setShowModal(false);

        loadTransactions(activeSpace.id);
    };

    const handleCreateSpace = async (e) => {
        e.preventDefault();

        if (!spaceName.trim() || !user) return;

        const { data: newSpace, error: spaceError } = await supabase
            .from("spaces")
            .insert([
                {
                    name: spaceName,
                    type: "shared",
                    owner_id: user.id,
                },
            ])
            .select()
            .single();

        if (spaceError) {
            console.log(spaceError);
            return;
        }

        const { error: memberError } = await supabase.from("space_members").insert([
            {
                space_id: newSpace.id,
                user_id: user.id,
            },
        ]);

        if (memberError) {
            console.log(memberError);
            return;
        }

        setSpaces([...spaces, newSpace]);
        setActiveSpace(newSpace);
        setTransactions([]);
        setBudgets([]);
        setMembers([]);
        setSummary({
            income: 0,
            expenses: 0,
            balance: 0,
        });

        setSpaceName("");
        setSpaceEmoji("💰");
        setShowSpaceModal(false);

        loadMembers(newSpace.id);
        loadBudgets(newSpace.id);
    };

    const handleInviteMember = async (e) => {
        e.preventDefault();

        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("email", inviteEmail)
            .single();

        if (profileError || !profile) {
            alert("User not found.");
            return;
        }

        const { error } = await supabase.from("space_members").insert([
            {
                space_id: activeSpace.id,
                user_id: profile.id,
            },
        ]);

        if (error) {
            console.log(error);
            alert("Failed to invite member.");
            return;
        }

        setInviteEmail("");
        setShowInviteModal(false);

        loadMembers(activeSpace.id);
    };

    const handleDeleteTransaction = async (transactionId) => {
        const confirmDelete = window.confirm("Delete this transaction?");

        if (!confirmDelete) return;

        const { error } = await supabase
            .from("transactions")
            .delete()
            .eq("id", transactionId);

        if (error) {
            console.log(error);
            alert("Failed to delete transaction.");
            return;
        }

        loadTransactions(activeSpace.id);
    };

    const handleCreateBudget = async (e) => {
        e.preventDefault();

        const payload = {
            space_id: activeSpace.id,
            title: budgetForm.title,
            category: budgetForm.category,
            monthly_limit: Number(budgetForm.monthly_limit),
        };

        if (editingBudget) {
            const { error } = await supabase
                .from("budgets")
                .update(payload)
                .eq("id", editingBudget.id);

            if (error) {
                console.log(error);
                return;
            }
        } else {
            const { error } = await supabase.from("budgets").insert([payload]);

            if (error) {
                console.log(error);
                return;
            }
        }

        setBudgetForm({
            title: "",
            category: "",
            monthly_limit: "",
        });

        setEditingBudget(null);
        setShowBudgetModal(false);
        loadBudgets(activeSpace.id);
    };

    const handleCreateRecurring = async (e) => {
        e.preventDefault();

        const today = new Date().toISOString().split("T")[0];

        const { error } = await supabase.from("recurring_transactions").insert([
            {
                space_id: activeSpace.id,
                created_by: user.id,
                type: recurringForm.type,
                amount: Number(recurringForm.amount),
                category: recurringForm.category,
                description: recurringForm.description,
                frequency: recurringForm.frequency,
                next_run: today,
                recurring_day_1:
                    recurringForm.frequency === "semi_monthly"
                        ? Number(recurringForm.recurring_day_1)
                        : null,
                recurring_day_2:
                    recurringForm.frequency === "semi_monthly"
                        ? Number(recurringForm.recurring_day_2)
                        : null,
            },
        ]);

        if (error) {
            console.log(error);
            return;
        }

        setRecurringForm({
            type: "expense",
            amount: "",
            category: "",
            description: "",
            frequency: "monthly",
            recurring_day_1: "",
            recurring_day_2: "",
        });

        setShowRecurringModal(false);
    };

    const expenseByCategory = Object.values(
        transactions
            .filter((item) => item.type === "expense")
            .reduce((acc, item) => {
                if (!acc[item.category]) {
                    acc[item.category] = {
                        name: item.category,
                        value: 0,
                        color: categoryConfig[item.category]?.color || "#6b7280",
                    };
                }

                acc[item.category].value += Number(item.amount);
                return acc;
            }, {})
    );

    const loadGoals = async (spaceId) => {
        const { data, error } = await supabase
            .from("goals")
            .select("*")
            .eq("space_id", spaceId)
            .order("created_at", {
                ascending: false,
            });

        if (error) {
            console.log(error);
            return;
        }

        setGoals(data);
    };

    const handleCreateGoal = async (e) => {
        e.preventDefault();

        const payload = {
            space_id: activeSpace.id,
            title: goalForm.title,
            target_amount: Number(goalForm.target_amount),
            current_amount: Number(goalForm.current_amount || 0),
            deadline: goalForm.deadline || null,
        };

        if (editingGoal) {
            const { error } = await supabase
                .from("goals")
                .update(payload)
                .eq("id", editingGoal.id);

            if (error) {
                console.log(error);
                return;
            }
        } else {
            const { error } = await supabase.from("goals").insert([payload]);

            if (error) {
                console.log(error);
                return;
            }
        }

        setGoalForm({
            title: "",
            target_amount: "",
            current_amount: "",
            deadline: "",
        });

        setEditingGoal(null);
        setShowGoalModal(false);
        loadGoals(activeSpace.id);
    };
    const loadNotifications = async (userId) => {
        if (!userId) return;

        const { data, error } = await supabase
            .from("notifications")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            console.log(error);
            return;
        }

        setNotifications(data);
    };

    const notifyUser = async ({
        title,
        message,
        type = "info",
        dedupeKey = null,
    }) => {
        if (!user) return;

        const { error } = await supabase.from("notifications").insert([
            {
                user_id: user.id,
                title,
                message,
                type,
                dedupe_key: dedupeKey,
            },
        ]);

        if (error) {
            if (error.code !== "23505") {
                console.log(error);
            }
            return;
        }

        loadNotifications(user.id);
    };

    const markNotificationsAsRead =
        async () => {
            if (!user) return;

            const unreadIds =
                notifications
                    .filter(
                        (n) => !n.is_read
                    )
                    .map((n) => n.id);

            if (unreadIds.length === 0)
                return;

            const { error } =
                await supabase
                    .from("notifications")
                    .update({
                        is_read: true,
                    })
                    .in("id", unreadIds);

            if (error) {
                console.log(error);
                return;
            }

            loadNotifications(user.id);
        };

    const cleanupOldNotifications = async (userId) => {
        if (!userId) return;

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 30);

        const { error } = await supabase
            .from("notifications")
            .delete()
            .eq("user_id", userId)
            .lt("created_at", cutoffDate.toISOString());

        if (error) {
            console.log(error);
        }
    };

    const handleDeleteBudget = async (budgetId) => {
        const confirmDelete = window.confirm("Delete this budget?");

        if (!confirmDelete) return;

        const { error } = await supabase.from("budgets").delete().eq("id", budgetId);

        if (error) {
            console.log(error);
            alert("Failed to delete budget.");
            return;
        }

        loadBudgets(activeSpace.id);
    };

    const handleDeleteGoal = async (goalId) => {
        const confirmDelete = window.confirm("Delete this goal?");

        if (!confirmDelete) return;

        const { error } = await supabase.from("goals").delete().eq("id", goalId);

        if (error) {
            console.log(error);
            alert("Failed to delete goal.");
            return;
        }

        loadGoals(activeSpace.id);
    };

    const handleDeleteSpace = async (spaceId) => {
        const confirmDelete = window.confirm(
            "Delete this shared space? This will also delete its transactions, budgets, goals, and members."
        );

        if (!confirmDelete) return;

        const { error } = await supabase
            .from("spaces")
            .delete()
            .eq("id", spaceId)
            .neq("type", "personal");

        if (error) {
            console.log(error);
            alert("Failed to delete space.");
            return;
        }

        const updatedSpaces = spaces.filter((space) => space.id !== spaceId);
        setSpaces(updatedSpaces);

        if (updatedSpaces.length > 0) {
            const nextSpace = updatedSpaces[0];

            setActiveSpace(nextSpace);
            loadTransactions(nextSpace.id);
            loadMembers(nextSpace.id);
            loadBudgets(nextSpace.id);
            loadGoals(nextSpace.id);
        }
    };

    const incomeExpenseData = [
        {
            name: "Income",
            amount: summary.income,
        },
        {
            name: "Expenses",
            amount: summary.expenses,
        },
    ];

    const displayName =
        user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Bestie";

    if (pageLoading) {
        return <AppLoader />;
    }
    return (
        <div className={darkMode ? "app-shell dark-mode" : "app-shell"}>
            <Header
                displayName={displayName}
                darkMode={darkMode}
                onToggleDarkMode={() => setDarkMode(!darkMode)}
                onLogout={handleLogout}
                notifications={notifications}
                showNotifications={showNotifications}
                setShowNotifications={setShowNotifications}
                markNotificationsAsRead={
                    markNotificationsAsRead
                }
            />

            {activeTab === "overview" && (
                <>
                    <BalanceCard summary={summary} />
                    <OverviewStats
                        summary={summary}
                        goals={goals}
                        budgets={budgets}
                        alerts={alerts}
                    />
                    <RecentActivity transactions={transactions} />
                    <AlertSection alerts={alerts} />
                    <InsightsSection
                        insights={insights}
                    />
                </>
            )}

            {activeTab === "transactions" && (
                <TransactionsSection
                    transactions={transactions}
                    activeSpace={activeSpace}
                    onAdd={() => setShowModal(true)}
                    onRecurring={() => setShowRecurringModal(true)}
                    onDelete={handleDeleteTransaction}
                    onEdit={(item) => {
                        setEditingTransaction(item);

                        setTransactionForm({
                            type: item.type,
                            amount: item.amount,
                            category: item.category,
                            description: item.description || "",
                        });

                        setShowModal(true);
                    }}
                />
            )}

            {activeTab === "planning" && (
                <>
                    <BudgetSection
                        budgets={budgets}
                        transactions={transactions}
                        onCreateBudget={() => setShowBudgetModal(true)}
                        onDeleteBudget={handleDeleteBudget}
                        onEditBudget={(budget) => {
                            setEditingBudget(budget);

                            setBudgetForm({
                                title: budget.title || "",
                                category: budget.category,
                                monthly_limit: budget.monthly_limit,
                            });

                            setShowBudgetModal(true);
                        }}
                    />
                    <GoalsSection
                        goals={goals}
                        onCreateGoal={() => setShowGoalModal(true)}
                        onDeleteGoal={handleDeleteGoal}
                        onEditGoal={(goal) => {
                            setEditingGoal(goal);

                            setGoalForm({
                                title: goal.title,
                                target_amount: goal.target_amount,
                                current_amount: goal.current_amount,
                                deadline: goal.deadline || "",
                            });

                            setShowGoalModal(true);
                        }}
                    />
                </>
            )}

            {activeTab === "analytics" && (
                <>
                    <MonthlyTrendChart
                        transactions={transactions}
                    />
                    <AnalyticsSection
                        transactions={transactions}
                        expenseByCategory={expenseByCategory}
                        incomeExpenseData={incomeExpenseData}
                        activeSpace={activeSpace}
                    />
                </>

            )}

            {activeTab === "people" && (
                <>
                    <SpacesSection
                        spaces={spaces}
                        activeSpace={activeSpace}
                        onCreateSpace={() => setShowSpaceModal(true)}
                        onDeleteSpace={handleDeleteSpace}
                        onSelectSpace={async (space) => {
                            setActiveSpace(space);

                            await processRecurringTransactions({
                                supabase,
                                spaceId: space.id,
                            });

                            loadTransactions(space.id);
                            loadMembers(space.id);
                            loadBudgets(space.id);
                            loadGoals(space.id);
                        }}
                    />
                    <MembersSection
                        activeSpace={activeSpace}
                        members={members}
                        onInvite={() => setShowInviteModal(true)}
                    />
                    <QuickInfoSection
                        activeSpace={activeSpace}
                    />
                </>
            )}


            {activeTab !== "analytics" && (
                <FloatingAddButton
                    label={
                        activeTab ===
                            "transactions"
                            ? "Transaction"
                            : activeTab ===
                                "planning"
                                ? "Goal"
                                : activeTab ===
                                    "people"
                                    ? "Space"
                                    : "Transaction"
                    }
                    onClick={() => {
                        if (
                            activeTab ===
                            "planning"
                        ) {
                            setShowGoalModal(true);
                        } else if (
                            activeTab ===
                            "people"
                        ) {
                            setShowSpaceModal(true);
                        } else {
                            setShowModal(true);
                        }
                    }}
                />
            )}

            <BottomNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            <TransactionModal
                show={showModal}
                editingTransaction={
                    editingTransaction
                }
                transactionForm={
                    transactionForm
                }
                setTransactionForm={
                    setTransactionForm
                }
                onSubmit={handleAddTransaction}
                onClose={() => {
                    setShowModal(false);
                    setEditingTransaction(null);
                }}
            />

            <SpaceModal
                show={showSpaceModal}
                spaceName={spaceName}
                setSpaceName={setSpaceName}
                spaceEmoji={spaceEmoji}
                setSpaceEmoji={setSpaceEmoji}
                onSubmit={handleCreateSpace}
                onClose={() => setShowSpaceModal(false)}
            />

            <InviteModal
                show={showInviteModal}
                inviteEmail={inviteEmail}
                setInviteEmail={setInviteEmail}
                onSubmit={handleInviteMember}
                onClose={() => setShowInviteModal(false)}
            />

            <BudgetModal
                show={showBudgetModal}
                editingBudget={editingBudget}
                budgetForm={budgetForm}
                setBudgetForm={setBudgetForm}
                onSubmit={handleCreateBudget}
                onClose={() => {
                    setShowBudgetModal(false);
                    setEditingBudget(null);
                }}
            />

            <RecurringModal
                show={showRecurringModal}
                recurringForm={recurringForm}
                setRecurringForm={setRecurringForm}
                onSubmit={handleCreateRecurring}
                onClose={() => setShowRecurringModal(false)}
            />

            <GoalModal
                show={showGoalModal}
                editingGoal={editingGoal}
                goalForm={goalForm}
                setGoalForm={setGoalForm}
                onSubmit={handleCreateGoal}
                onClose={() => {
                    setShowGoalModal(false);
                    setEditingGoal(null);
                }}
            />
        </div>
    );
}

export default Dashboard;