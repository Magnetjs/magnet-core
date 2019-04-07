import protoLoader from "@grpc/proto-loader";

const packageDefinition = protoLoader.loadSync("./protos/helloworld.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

export default function({ grpc, ctrls }) {
  grpc.addService(hello_proto.Greeter.service, {
    async sayHello(call, callback) {
      await ctrls.blog.index(call.request);
      callback(null, { message: `Hello ${call.request.name}` });
    }
  });
}
