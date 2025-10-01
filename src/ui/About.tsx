import { Users, Book, History } from 'lucide-react';
import Navbar from './Navbar'; 

const AboutSection = ({ icon: Icon, title, children }) => (
  <div className="mb-12">
    <div className="flex items-center mb-4">
      <Icon className="w-8 h-8 text-teal-400 mr-3" />
      <h2 className="text-3xl font-bold text-white">{title}</h2>
    </div>
    <div className="text-gray-300 space-y-4">
      {children}
    </div>
  </div>
);

const TeamMember = ({ name, role, image }) => (
  <div className="bg-gray-800 p-6 rounded-lg text-center">
    <img src={image} alt={name} className="w-32 h-32 rounded-full mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-white mb-2">{name}</h3>
    <p className="text-gray-400">{role}</p>
  </div>
);
const AboutPage = () => {
  return (
    <div className="w-full min-h-screen bg-gray-900 text-white">
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
            About StateCraft
          </h1>
          
          <AboutSection icon={Book} title="Our Mission">
            <p>
              At StateCraft, we're dedicated to making the Theory of Computation more accessible, engaging, and easier to grasp for students of all levels. Our mission is to empower learners with innovative tools and interactive visualizations that breathe life into complex topics like finite automata and regular expressions.
            </p>
            <p>
              By bridging the gap between abstract concepts and practical understanding, we help students engage with the material intuitively, providing them with the confidence and clarity to master these challenging areas of computer science.
            </p>
          </AboutSection>
          
          <AboutSection icon={History} title="Our Journey">
            <p>
              StateCraft was born from the idea that traditional methods of teaching computational theory—through text and equations alone—aren’t enough for today’s learners. Founded by a team of educators and developers, we set out to create a more dynamic learning experience, combining animations and simulations to make these difficult concepts easier to understand.
            </p>
            <p>
              What started as a small project quickly grew into a comprehensive educational platform used by thousands of students globally. Today, StateCraft helps learners visualize and interact with the building blocks of computation, making difficult theories more accessible than ever.
            </p>
          </AboutSection>
          
          <AboutSection icon={Users} title="Why StateCraft">
            <p>
              StateCraft brings Theory of Computation concepts to life through engaging animations and interactive simulations. Our platform helps students better understand finite automata, regular expressions, and more by letting them visualize these concepts in real-time, fostering a deeper and more intuitive understanding.
            </p>
            <p>
              We prioritize accuracy in all our simulations, ensuring that the visualizations and interactions are reliable and grounded in solid theory. Our goal is to create an experience that’s as educational as it is enjoyable, with intuitive UI/UX design that makes the platform easy to use for students of all levels.
            </p>
          </AboutSection>
          
          <AboutSection icon={Users} title="Our Team">
            <p className="mb-6">
              The team behind StateCraft is composed of passionate educators, developers, and computer science enthusiasts, all working towards a common goal: making complex theoretical concepts accessible to everyone.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TeamMember 
                name="Naufil Asar" 
                role="SWE | Linux Enthusiast" 
                image="https://avatars.githubusercontent.com/u/145439464?v=4"
              />
              <TeamMember 
                name="Manjiri Chavande" 
                role="SWE | Open Source" 
                image="https://avatars.githubusercontent.com/u/82377810?v=4"
              />
              <TeamMember 
                name="Sumit Patel" 
                role="DevOps | Linux Enthusiast" 
                image="https://avatars.githubusercontent.com/u/89197795?v=4"
              />
            </div>
          </AboutSection>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-gray-300 py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 StateCraft. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
