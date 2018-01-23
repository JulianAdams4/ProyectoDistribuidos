# -*- coding: utf-8 -*-

import glob
import sys
import MySQLdb
import redis # ==> Make sure to install this library using pip install redis
from datetime import datetime
import time
import cPickle
import hashlib

sys.path.append('gen-py')
#sys.path.insert(0, glob.glob('../../lib/py/build/lib*')[0])

from news import GetNews
from news.ttypes import News

from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol
from thrift.server import TServer

DB_HOST = 'localhost' 
DB_USER = 'root' 
DB_PASS = '1234' 
DB_NAME = 'distribuidos'
R_SERVER = redis.Redis("localhost")
datos = [DB_HOST, DB_USER, DB_PASS, DB_NAME] 
conn = MySQLdb.connect(*datos) # Conectar a la base de datos 
CURSOR = conn.cursor()

class NewsHandler():
    def __init__(self):
        self.log = {}

    def ping(self):
        print('ping()')

    def getTopNews(self):
        listNews = []
        print("Get notices")
        query = "SELECT * FROM noticias order by num_accesos DESC limit 10;" 
        startTime = datetime.now()
        result = self.cache_redis(query)
        stopTime = datetime.now()
        # print("Tiempo transcurrido: %f"%stopTime-startTime)
        print (result)
        for res in result:

            listNews.append(News(str(res[1]), str(res[2]), int(res[0]), int(res[3])))
        
        return listNews

    def cache_redis(self, sql, TTL = 360):
        # INPUT 1 : SQL query
        # INPUT 2 : Time To Life
        # OUTPUT  : Array of result
        
        # Create a hash key
        tiempo = time.strftime("%H:%M")
        hash = hashlib.sha224(tiempo).hexdigest()
        
        key = "tiempo_cache:" + hash
        print ("Created Key\t : %s" % key)

        # Check if data is in cache.
        if (R_SERVER.get(key)):
            print ("This was return from redis")    
            return cPickle.loads(R_SERVER.get(key))
        else:
            # Do MySQL query   
            CURSOR.execute(sql)
            data = CURSOR.fetchall()
            
            # Put data into cache for 1 hour
            R_SERVER.set(key, cPickle.dumps(data) )
            R_SERVER.expire(key, TTL)

            print ("Set data redis and return the data")
            return cPickle.loads(R_SERVER.get(key))


if __name__ == '__main__':
    # START TIME
    startTime = datetime.now()
    handler = NewsHandler()
    processor = GetNews.Processor(handler)
    transport = TSocket.TServerSocket(host='127.0.0.1', port=9090)
    tfactory = TTransport.TBufferedTransportFactory()
    pfactory = TBinaryProtocol.TBinaryProtocolFactory()

    server = TServer.TSimpleServer(processor, transport, tfactory, pfactory)

    # You could do one of these for a multithreaded server
    # server = TServer.TThreadedServer(
    #     processor, transport, tfactory, pfactory)

    server.serve()