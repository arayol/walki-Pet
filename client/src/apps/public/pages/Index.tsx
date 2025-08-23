
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MapPin, Shield, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/shared/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      {/* Hero Section */}
      <section className="relative px-4 pt-8 pb-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Cuidado especial para seu{" "}
              <span className="text-blue-600">melhor amigo</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Conecte-se com dog walkers de confiança na sua região. 
              Passeios seguros, cuidado personalizado e tranquilidade para você.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="w-full sm:w-auto">
                  Sou Dog Walker
                </Button>
              </Link>
              <Link to="/client-landing">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Sou Dono de Pet
                </Button>
              </Link>
            </div>
            <div className="mt-6">
              <Link to="/pricing" className="text-blue-600 hover:text-blue-800 font-medium">
                Ver Planos e Preços →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher nossa plataforma?
            </h2>
            <p className="text-xl text-gray-600">
              Segurança, confiança e praticidade em um só lugar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>100% Seguro</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Todos os dog walkers são verificados e avaliados pela comunidade
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Localização</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Encontre dog walkers próximos a você com facilidade
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Star className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <CardTitle>Avaliados</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Sistema de avaliações transparente para sua segurança
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Cuidado</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Profissionais dedicados ao bem-estar do seu pet
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Cadastre-se agora e encontre o dog walker perfeito para seu pet
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Cadastrar como Dog Walker
              </Button>
            </Link>
            <Link to="/client-area">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-blue-600">
                Encontrar Dog Walker
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">DogWalker</h3>
              <p className="text-gray-400">
                Conectando pets e seus cuidadores com segurança e confiança.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Links Úteis</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/auth" className="hover:text-white">Para Dog Walkers</Link></li>
                <li><Link to="/client-area" className="hover:text-white">Para Donos de Pets</Link></li>
                <li><Link to="/pricing" className="hover:text-white">Planos e Preços</Link></li>
                <li><Link to="/terms" className="hover:text-white">Termos de Uso</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contato</h4>
              <p className="text-gray-400">
                Dúvidas? Entre em contato conosco.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DogWalker. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
