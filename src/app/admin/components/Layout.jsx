import Navbar from '../navigation/Navbar'
// import Footer from "../components/FooterCmp/Footer"

function Layout({children}) {
  return (
    <>
    <Navbar />
        <main>
            {children}
        </main>
      {/* <Footer /> */}
    </>
  )
}

export default Layout