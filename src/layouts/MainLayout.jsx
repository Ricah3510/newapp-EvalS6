import Header from "../components/Header";

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