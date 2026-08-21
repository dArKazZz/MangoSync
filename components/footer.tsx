/**
 * Componente del Pie de Página (Footer).
 *
 * Rinde el pie de página de la aplicación.
 * 
 * @returns {JSX.Element}
 */
function Footer() {
  return (
    <footer className="border-t py-6">
      <p className="text-center text-sm leading-loose text-muted-foreground">
        &copy; 2026 MangoSync. Todos los derechos reservados.
      </p>
    </footer>
  );
}

export default Footer;