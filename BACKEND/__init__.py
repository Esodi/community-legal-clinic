from flask import Flask
from service.routes import bp as services_bp
from testimonial.routes import bp as testimonials_bp

def create_app():
    app = Flask(__name__)
    
    # Register blueprints
    app.register_blueprint(services_bp)
    app.register_blueprint(testimonials_bp)
    
    return app 