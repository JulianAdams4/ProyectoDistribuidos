
import pymysql

#ojo poner la coneccion y la base a donde se vana a conectar
db = pymysql.connect("localhost","root","luis987","prueba" )

#esto nos lee el archivo csv
with open('newsCorpora.csv', 'r') as archivo:
    #esto nos lee cada linea del archivo y los guada como una cadena de lineas
    lineas=archivo.read().splitlines()

    #iteramos las lineas para poder trabajarlas independientemente
    for l in lineas:

        #abrimos el cursor de mysql para poder conectarla.
        cursor = db.cursor()
        
        #separamos cada dato de la linea para poder guardala en su respectivo campo
        linea = l.split('\t')
        
        #creamos el query de insercion a la base
        sql = "INSERT INTO prueba.distribuido(descripcion, rss, revista, opcional, token_str, paginas, token_num) \
                VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s' )" % \
                (linea[1].replace("'s",''),linea[2],linea[3],linea[4], linea[5], linea[6], linea[7])
        
        try:
            #ejecuta el query antes creado
            cursor.execute(sql)
            #hace el commit de ser posible a la base
            db.commit()
            print("se ha realizado con exito el insert")

        except:
            #error al no poder guardarla
            db.rollback()
            print("ocurrio algun error al momento de insertar")
    #cerramos el curso de mysql            
    db.close()