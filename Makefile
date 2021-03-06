#==================================================================
#
#   Nodejs Scripts for initialize the project
#   	start = run the project
#   	install = install dependencies
#   	clean = clean installed dependencies
#
#   Nota;
#     Poner en orden los valores de las entradas de cada target
#   Por ejemplo:
#     all: database start
#
#   Ejecutara primero database y luego start
#
#==================================================================

all: install database start test


install:
	@echo ".------------------------------------.";
	@echo "|     Instalando dependencias...     |";
	@echo "'------------------------------------'";
	@npm install
	@echo ".-----------------------------.";
	@echo "|     Operacion terminada     |";
	@echo "'-----------------------------'";


database:
	@echo ".------------------------------------.";
	@echo "|     Llenando base de datos...      |";
	@echo "'------------------------------------'";
	@cd ./databaseScripts && node ./seedDatabase.js
	@echo ".-----------------------------.";
	@echo "|     Operacion terminada     |";
	@echo "'-----------------------------'";


start:
	npm start


test:
	@echo ".------------------------------------.";
	@echo "|       Ejecutando pruebas...        |";
	@echo "'------------------------------------'";
	@npm run benchmark
	@echo ".------------------------------------.";
	@echo "|        Pruebas terminadas          |";
	@echo "'------------------------------------'";
	@echo "\nVisite las rutas:";
	@echo "\t/benchmarkNoCache";
	@echo "\t/benchmarkCache";


clean:
	@echo ".------------------------------------.";
	@echo "|    Eliminando 'node_modules'...    |";
	@echo "'------------------------------------'";
	@rm -rf ./node_modules
	@echo ".-----------------------------.";
	@echo "|     Operacion terminada     |";
	@echo "'-----------------------------'";