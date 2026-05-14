import Header from "../../components/admin/Header";

function MainLayout({ children }) {
    return (
        <div>
            <Header />
            <main style={{ padding: "20px" }}>
                {children}
            </main>
        </div>
    );
}
export default MainLayout;