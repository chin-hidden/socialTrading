from robot.libraries.BuiltIn import BuiltIn
import pika


class CustomCommands(object):
    def location_should_not_contain(self, pattern):
        seleniumlib = BuiltIn().get_library_instance('Selenium2Library')
        location = seleniumlib.get_location()
        return location.find(pattern) == -1

    def execute_order(self, order, exchange='NotiCenter.Exchange.ExecutedOrder'):
        params = pika.URLParameters("amqp://guest:guest@172.28.128.3:5672/")
        connection = pika.BlockingConnection(params)
        channel = connection.channel()

        properties = pika.BasicProperties(content_type='application/json')
        channel.basic_publish(exchange=exchange,
                              routing_key="",
                              body=order,
                              properties=properties)
        connection.close()
