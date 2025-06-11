from setuptools import setup, find_packages

setup(
    name='erpnext_hn',
    version='0.0.1',
    description='Localización Hondureña para ERPNext',
    author='Tu Nombre o Empresa',
    author_email='soporte@ejemplo.com',
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    install_requires=['frappe'],
)
