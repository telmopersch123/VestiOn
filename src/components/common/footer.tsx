const Footer = () => {
  return (
    <footer className="mt-10 bg-white shadow-md">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-6 py-6 text-gray-600 md:flex-row">
        {/* Logo ou nome */}
        <h2 className="text-lg font-semibold tracking-wide text-gray-800">
          VestiOn
        </h2>

        {/* Links */}
        <nav className="mt-4 flex gap-6 md:mt-0">
          <a href="#" className="transition hover:text-gray-900">
            Início
          </a>
          <a href="#" className="transition hover:text-gray-900">
            Loja
          </a>
          <a href="#" className="transition hover:text-gray-900">
            Sobre
          </a>
          <a href="#" className="transition hover:text-gray-900">
            Contato
          </a>
        </nav>

        {/* Direitos autorais */}
        <p className="mt-4 text-sm md:mt-0">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold">VestiOn</span>. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
