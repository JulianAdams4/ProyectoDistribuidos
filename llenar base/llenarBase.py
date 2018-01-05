
import pymysql

# 打开数据库连接
db = pymysql.connect("localhost","root","luis987","prueba" )

# 使用cursor()方法获取操作游标 
cursor = db.cursor()

# SQL 插入语句
with open('newsCorpora.csv', 'r') as archivo:
    lineas=archivo.read().splitlines()
    for l in lineas:
        linea = l.split('\t')
        num=linea[0]
        #print(linea)
        sql = "INSERT INTO prueba.distribuido(descripcion, rss, revista, opcional, token_str, page, token_num) \
                VALUES (%s', '%s', '%s', '%s', '%s', '%s', '%s' )" % \
                (linea[1],linea[2],linea[3],linea[4], linea[5], linea[6], linea[7])
        print (sql)
        try:
            # 执行sql语句
            cursor.execute(sql)
            # 执行sql语句
            db.commit()
            print("se ha realizado con exito el insert")
        except:
            # 发生错误时回滚
            db.rollback()
            print("ocurrio algun error al momento de insertar")

# 关闭数据库连接
 


db.close()

