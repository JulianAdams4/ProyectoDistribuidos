#
# Autogenerated by Thrift Compiler (0.9.2)
#
# DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
#
#  options string: py
#

from thrift.Thrift import TType, TMessageType, TException, TApplicationException

from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol, TProtocol
try:
  from thrift.protocol import fastbinary
except:
  fastbinary = None



class News:
  """
  Attributes:
   - title
   - description
   - num_noticia
   - num_accesos
  """

  thrift_spec = (
    None, # 0
    (1, TType.STRING, 'title', None, None, ), # 1
    (2, TType.STRING, 'description', None, None, ), # 2
    (3, TType.I32, 'num_noticia', None, None, ), # 3
    (4, TType.I32, 'num_accesos', None, None, ), # 4
  )

  def __init__(self, title=None, description=None, num_noticia=None, num_accesos=None,):
    self.title = title
    self.description = description
    self.num_noticia = num_noticia
    self.num_accesos = num_accesos

  def read(self, iprot):
    if iprot.__class__ == TBinaryProtocol.TBinaryProtocolAccelerated and isinstance(iprot.trans, TTransport.CReadableTransport) and self.thrift_spec is not None and fastbinary is not None:
      fastbinary.decode_binary(self, iprot.trans, (self.__class__, self.thrift_spec))
      return
    iprot.readStructBegin()
    while True:
      (fname, ftype, fid) = iprot.readFieldBegin()
      if ftype == TType.STOP:
        break
      if fid == 1:
        if ftype == TType.STRING:
          self.title = iprot.readString();
        else:
          iprot.skip(ftype)
      elif fid == 2:
        if ftype == TType.STRING:
          self.description = iprot.readString();
        else:
          iprot.skip(ftype)
      elif fid == 3:
        if ftype == TType.I32:
          self.num_noticia = iprot.readI32();
        else:
          iprot.skip(ftype)
      elif fid == 4:
        if ftype == TType.I32:
          self.num_accesos = iprot.readI32();
        else:
          iprot.skip(ftype)
      else:
        iprot.skip(ftype)
      iprot.readFieldEnd()
    iprot.readStructEnd()

  def write(self, oprot):
    if oprot.__class__ == TBinaryProtocol.TBinaryProtocolAccelerated and self.thrift_spec is not None and fastbinary is not None:
      oprot.trans.write(fastbinary.encode_binary(self, (self.__class__, self.thrift_spec)))
      return
    oprot.writeStructBegin('News')
    if self.title is not None:
      oprot.writeFieldBegin('title', TType.STRING, 1)
      oprot.writeString(self.title)
      oprot.writeFieldEnd()
    if self.description is not None:
      oprot.writeFieldBegin('description', TType.STRING, 2)
      oprot.writeString(self.description)
      oprot.writeFieldEnd()
    if self.num_noticia is not None:
      oprot.writeFieldBegin('num_noticia', TType.I32, 3)
      oprot.writeI32(self.num_noticia)
      oprot.writeFieldEnd()
    if self.num_accesos is not None:
      oprot.writeFieldBegin('num_accesos', TType.I32, 4)
      oprot.writeI32(self.num_accesos)
      oprot.writeFieldEnd()
    oprot.writeFieldStop()
    oprot.writeStructEnd()

  def validate(self):
    return


  def __hash__(self):
    value = 17
    value = (value * 31) ^ hash(self.title)
    value = (value * 31) ^ hash(self.description)
    value = (value * 31) ^ hash(self.num_noticia)
    value = (value * 31) ^ hash(self.num_accesos)
    return value

  def __repr__(self):
    L = ['%s=%r' % (key, value)
      for key, value in self.__dict__.iteritems()]
    return '%s(%s)' % (self.__class__.__name__, ', '.join(L))

  def __eq__(self, other):
    return isinstance(other, self.__class__) and self.__dict__ == other.__dict__

  def __ne__(self, other):
    return not (self == other)

class InvalidOperation(TException):
  """
  Attributes:
   - what
   - why
  """

  thrift_spec = (
    None, # 0
    (1, TType.I32, 'what', None, None, ), # 1
    (2, TType.STRING, 'why', None, None, ), # 2
  )

  def __init__(self, what=None, why=None,):
    self.what = what
    self.why = why

  def read(self, iprot):
    if iprot.__class__ == TBinaryProtocol.TBinaryProtocolAccelerated and isinstance(iprot.trans, TTransport.CReadableTransport) and self.thrift_spec is not None and fastbinary is not None:
      fastbinary.decode_binary(self, iprot.trans, (self.__class__, self.thrift_spec))
      return
    iprot.readStructBegin()
    while True:
      (fname, ftype, fid) = iprot.readFieldBegin()
      if ftype == TType.STOP:
        break
      if fid == 1:
        if ftype == TType.I32:
          self.what = iprot.readI32();
        else:
          iprot.skip(ftype)
      elif fid == 2:
        if ftype == TType.STRING:
          self.why = iprot.readString();
        else:
          iprot.skip(ftype)
      else:
        iprot.skip(ftype)
      iprot.readFieldEnd()
    iprot.readStructEnd()

  def write(self, oprot):
    if oprot.__class__ == TBinaryProtocol.TBinaryProtocolAccelerated and self.thrift_spec is not None and fastbinary is not None:
      oprot.trans.write(fastbinary.encode_binary(self, (self.__class__, self.thrift_spec)))
      return
    oprot.writeStructBegin('InvalidOperation')
    if self.what is not None:
      oprot.writeFieldBegin('what', TType.I32, 1)
      oprot.writeI32(self.what)
      oprot.writeFieldEnd()
    if self.why is not None:
      oprot.writeFieldBegin('why', TType.STRING, 2)
      oprot.writeString(self.why)
      oprot.writeFieldEnd()
    oprot.writeFieldStop()
    oprot.writeStructEnd()

  def validate(self):
    return


  def __str__(self):
    return repr(self)

  def __hash__(self):
    value = 17
    value = (value * 31) ^ hash(self.what)
    value = (value * 31) ^ hash(self.why)
    return value

  def __repr__(self):
    L = ['%s=%r' % (key, value)
      for key, value in self.__dict__.iteritems()]
    return '%s(%s)' % (self.__class__.__name__, ', '.join(L))

  def __eq__(self, other):
    return isinstance(other, self.__class__) and self.__dict__ == other.__dict__

  def __ne__(self, other):
    return not (self == other)
