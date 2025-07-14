import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import wale from '../components/images/wale.jpg';
import ayobami from '../components/images/ayobami.jpg';
import ike from '../components/images/ike.jpg';


import { 
  GraduationCap, 
  Users, 
  Calendar, 
  Award, 
  ArrowRight, 
  Image as ImageIcon,
  Star,
  Quote,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';

const Landing = () => {
  const testimonials = [
    {
      id: 1,
      name: "Ebitigha Adewala",
      course: "Mechanical Engineering",
      image: wale,
      text: "Mabest Academy didn't just give me an education; it gave me a family. The connections I made here continue to open doors in my career.",
      rating: 5
    },
    {
      id: 2,
      name: "Oluwadiya ayobami",
      course: "Computer science ",
      image: ayobami,
      text: "The alumni network is incredible. I've found mentors, business partners, and lifelong friends through this community.",
      rating: 5
    },
    {
      id: 3,
      name: "Aladeniy Ikeoluwapo",
      course: "Pharmacy",
      image: ike,
      text: "Being part of the Mabest Academy alumni network has been transformative. The support and opportunities are endless.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 container mx-auto px-6 py-8"
      >
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GraduationCap className="w-8 h-8 text-white" />
            <span className="text-2xl font-bold text-white">Mabest Academy</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-white hover:text-blue-200 transition-colors duration-300 font-medium"
            >
              Login
            </Link>
            <Link
              to="/gallery"
              className="text-white hover:text-blue-200 transition-colors duration-300 font-medium"
            >
              Gallery
            </Link>
            <Link
              to="/register"
              className="bg-white text-blue-900 px-6 py-2 rounded-full font-medium hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
            >
              Join Now
            </Link>
          </div>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative z-10 container mx-auto px-6 py-20 text-center"
      >
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-shadow">
          Connect with Your
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300"> Alumni Network</span>
        </h1>
        <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
          Join the vibrant community of Mabest Academy graduates. Share memories, build connections, and celebrate achievements together.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="btn-primary text-white px-8 py-4 rounded-full font-semibold text-lg inline-flex items-center justify-center space-x-2 group"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/gallery"
            className="glass-effect text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:bg-opacity-20 transition-all duration-300 inline-flex items-center justify-center space-x-2"
          >
            <ImageIcon className="w-5 h-5" />
            <span>View Gallery</span>
          </Link>
          <Link
            to="/login"
            className="glass-effect text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:bg-opacity-20 transition-all duration-300"
          >
            Sign In
          </Link>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="relative z-10 container mx-auto px-6 py-20"
      >
        <h2 className="text-4xl font-bold text-white text-center mb-16">Why Join Our Alumni Network?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Users,
              title: "Connect with Peers",
              description: "Build meaningful relationships with fellow graduates and expand your professional network."
            },
            {
              icon: Calendar,
              title: "Exclusive Events",
              description: "Access to alumni-only events, reunions, and professional development opportunities."
            },
            {
              icon: Award,
              title: "Share Achievements",
              description: "Celebrate your successes and milestones with your academic community."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 + index * 0.2 }}
              className="glass-effect p-8 rounded-2xl card-hover text-center"
            >
              <feature.icon className="w-16 h-16 text-blue-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-4">{feature.title}</h3>
              <p className="text-blue-100 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.0 }}
        className="relative z-10 container mx-auto px-6 py-20"
      >
        <h2 className="text-4xl font-bold text-white text-center mb-16">What Our Alumni Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 + index * 0.2 }}
              className="glass-effect p-8 rounded-2xl card-hover"
            >
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="text-lg font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-blue-200 text-sm">{testimonial.course}</p>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <div className="relative">
                <Quote className="w-8 h-8 text-blue-300 opacity-50 absolute -top-2 -left-2" />
                <p className="text-blue-100 leading-relaxed pl-6">{testimonial.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="relative z-10 container mx-auto px-6 py-20 text-center"
      >
        <div className="glass-effect rounded-3xl p-12 mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Reconnect?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of Mabest Academy graduates in our growing alumni community.
          </p>
          <Link
            to="/register"
            className="btn-secondary text-gray-800 px-12 py-4 rounded-full font-semibold text-lg inline-flex items-center space-x-2 group"
          >
            <span>Start Your Journey</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.6 }}
        className="relative z-10 bg-black bg-opacity-30 border-t border-white border-opacity-20"
      >
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <GraduationCap className="w-8 h-8 text-white" />
                <span className="text-2xl font-bold text-white">Mabest Academy</span>
              </div>
              <p className="text-blue-200 leading-relaxed mb-6">
                Connecting alumni worldwide through shared experiences, lasting friendships, and professional growth.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-300 hover:text-white transition-colors duration-300">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-blue-300 hover:text-white transition-colors duration-300">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-blue-300 hover:text-white transition-colors duration-300">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-blue-300 hover:text-white transition-colors duration-300">
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-blue-200 hover:text-white transition-colors duration-300">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/gallery" className="text-blue-200 hover:text-white transition-colors duration-300">
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-blue-200 hover:text-white transition-colors duration-300">
                    Join Network
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-blue-200 hover:text-white transition-colors duration-300">
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>

            {/* Alumni Services */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Alumni Services</h3>
              <ul className="space-y-3 text-blue-200">
                <li>Career Services</li>
                <li>Mentorship Program</li>
                <li>Alumni Directory</li>
                <li>Event Calendar</li>
                <li>Newsletter</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-blue-200">
                  <MapPin className="w-5 h-5" />
                  <span> Omolayo EState </span>
                </div>
                <div className="flex items-center space-x-3 text-blue-200">
                  <Phone className="w-5 h-5" />
                  <span>08161594572</span>
                </div>
                <div className="flex items-center space-x-3 text-blue-200">
                  <Mail className="w-5 h-5" />
                  <span>ayobamioluwadiya5@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white border-opacity-20 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-blue-200 text-sm">
              © 2025 Mabest Academy Alumni Network. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-blue-200 hover:text-white text-sm transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-blue-200 hover:text-white text-sm transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="text-blue-200 hover:text-white text-sm transition-colors duration-300">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Landing;