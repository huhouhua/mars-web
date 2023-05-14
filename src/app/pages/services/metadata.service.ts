import { Injectable } from '@angular/core';

import { cloneDeep } from 'lodash-es';
import { NzMessageService } from 'ng-zorro-antd/message';
@Injectable({
  providedIn: 'root',
})
export class MetadataService {
  args: any = {};
  serviceOptionsList:any[] =[];
  service = {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name: '',
      labels: {
        service: '',
        fromComponent: 'task-be',
        componentLayer: 'svc',
      },
    },
    spec: {
      selector: {
        app: '',
      },
      ports: [
        {
          protocol: 'TCP',
          port: 5000,
          targetPort: 5000,
          name: '',
        },
      ],
    },
  };

  configMap = {
    apiVersion: 'v1',
    kind: 'ConfigMap',
    metadata: {
      name: '',
      labels: {
        service: '',
      },
    },
    data: {},
  };

  deployment = {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      name: '',
      labels: {
        service: '',
      },
    },
    spec: {
      replicas: '1',
      selector: {
        matchLabels: {
          app: '',
        },
      },
      template: {
        metadata: {
          labels: {
            app: '',
            service: '',
          },
        },
        spec: {
          containers: [
            {
              image: '',
              name: '',
              imagePullPolicy: 'Always',
              ports: [
                {
                  containerPort: 5000,
                  name: '',
                },
              ],
              resources: {
                limits: {
                  memory: '4Gi',
                  cpu: '4',
                },
                requests: {
                  memory: '128Mi',
                  cpu: '10m',
                },
              },
              env: []=[],
            },
          ],
        },
      },
    },
  };

  // config.json
  formService: Array<any> = [
    {
      type: 'array',
      properties: [],
    },
  ];

  serviceName: string ='';
  configData: any = { yaml: null, metadata: null };
  appInfo: any = { appName: null, fromApp: null };
  portgroups: Array<any> = [];
  environments: Array<any> = [];

  constructor(private msg: NzMessageService) {}

  /**
   * 初始化 metaData和yaml
   * @param yamlObj
   * @returns
   */
  initDefaultServiceConfig(group:any,yamlObj:any):any {
    try {
    this.serviceName = group.serviceName;
      const metadata = this.generateMetadata();
      this.configData.metadata = metadata;
      const yaml = this.generateYamlTemplate(group,yamlObj);

      return {
        metadata,
        yaml,
      };
    } catch (error:any) {
      this.msg.error(error);
      console.error(error);
    }
  }

  generateMetadata() {
    return this.formService;
  }

  /**
   * 获取yaml
   * @param yamlData 为null 证明是新增
   * @returns
   */
  generateYamlTemplate(group:any, yamlData?: any):any {
    const args = this.args;
    const appName = this.appInfo.appName;
    let yaml: any = {};
    yaml.apiVersion = 'v1';
    yaml.items = [];
    yaml.kind = 'List';
    yaml.apiVersion = yaml.apiVersion || 'v1';
    yaml.items = yaml.items || [];
    yaml.kind = yaml.kind || 'List';

    // Service
    let newYamlItem: any = null;
    const yamlItem = yaml.items.filter(
        (      x: { kind: string; metadata: { name: string; }; }) => x.kind && x.kind === 'Service' && x.metadata && x.metadata.name && x.metadata.name === this.serviceName,
    );

    const allSvc = yaml.items.filter((x: { kind: string; }) => x.kind && x.kind === 'Service');

    if (true) {
      if (true) {
        newYamlItem =
          yamlItem && yamlItem.length > 0
            ? yamlItem[0]
            : allSvc && allSvc.length === 1
            ? allSvc[0]
            : cloneDeep(this.service);

        newYamlItem.metadata.name =this.serviceName;
        newYamlItem.metadata.labels.service = appName;

        newYamlItem.metadata.labels.fromComponent = this.serviceName;
   

        newYamlItem.spec.selector.app = this.serviceName;

        newYamlItem.spec.ports = [];
        newYamlItem.spec.type = 'ClusterIP';
        if (true) {
        //   portgroups.data.properties.forEach((g: { control: any; key: string; fixedConfig: any; }) => {
        //     const portItem: any = {};
        //     const control = g.control;
        //     portItem.name = control.name || '';
        //     portItem.port = control.port || '';
        //     portItem.targetPort = control.targetPort || '';
        //     portItem.protocol = 'TCP';
        //     if (control.valueSource === 0 && control.nodePort) {
        //       const port_ = this.findData(g.key, g);
        //       if (g.fixedConfig) {
        //         portItem.nodePort = control.nodePort;
        //       } else if (portgroups.routekey === '') {
        //         portItem.nodePort = `{{ ${port_.routekey} }}`;
        //       } else {
        //         portItem.nodePort = `{{ ${portgroups.routekey}.${port_.routekey} }}`;
        //       }
        //     } else {
        //       if (control.nodePort) {
        //         portItem.nodePort = `{{ ${control.nodePort} }}`;
        //       }
        //     }
        //     newYamlItem.spec.ports.push(portItem);
        //   });
        const portItem: any = {};
  
        newYamlItem.spec.ports.push(portItem);
    
        newYamlItem.spec.type = 'NodePort';
          if (true) {
            yaml.items.push(newYamlItem);
          }
        } else {
          yaml.items = yaml.items.filter(
              (            x: { kind: string; metadata: { name: string; }; }) =>
              !(
                x.kind &&
                x.kind === 'Service' &&
                x.metadata &&
                x.metadata.name &&
                x.metadata.name === this.serviceName
              ),
          );
        }
      } else {
        yaml.items = yaml.items.filter(
            (          x: { kind: string; metadata: { name: string; }; }) =>
            !(x.kind && x.kind === 'Service' && x.metadata && x.metadata.name && x.metadata.name === this.serviceName),
        );
      }
    } else {
      yaml.items = yaml.items.filter(
          (        x: { kind: string; metadata: { name: string; }; }) => !(x.kind && x.kind === 'Service' && x.metadata && x.metadata.name && x.metadata.name === this.serviceName),
      );
    }

    // Deployment
    let newDeployment: any = null;
    const deploy = yaml.items.filter(
        (      x: { kind: string; metadata: { name: string; }; }) =>
        x.kind && x.kind === 'Deployment' && x.metadata && x.metadata.name && x.metadata.name === `${this.serviceName}`,
    );
    const allDeploy = yaml.items.filter((x: { kind: string; }) => x.kind && x.kind === 'Deployment');

    if (allDeploy.length !== 0 || !yamlData) {
      if (this.serviceName) {
        newDeployment =
          deploy && deploy.length > 0
            ? deploy[0]
            : allDeploy && allDeploy.length === 1
            ? allDeploy[0]
            : cloneDeep(this.deployment);

        const replicasKey = `${this.serviceName}.replicas`;

        newDeployment.spec.replicas = 1;
        const replaceImageName = this.serviceName.replace(/_/g, '-');
        newDeployment.metadata.name = replaceImageName;
        newDeployment.metadata.labels.service = appName;

        newDeployment.spec.selector.matchLabels.app = replaceImageName;
        newDeployment.spec.template.metadata.labels.app = replaceImageName;
        newDeployment.spec.template.metadata.labels.service = appName;

        const repoUrl = `${ConfigNodeKeyName.images}.${this.serviceName}.${ConfigNodeKeyName.repoUrl}`;
        const version = `${ConfigNodeKeyName.images}.${this.serviceName}.${ConfigNodeKeyName.version}`;

        const imageName = `{{imageHost}}{{${repoUrl}}}:{{${version}}}`;
        newDeployment.spec.template.spec.containers[0].image = imageName;
        newDeployment.spec.template.spec.containers[0].name = replaceImageName;

        newDeployment.spec.template.spec.containers[0].ports.push({
            containerPort:5000 ,
            name: 'name-port',
          });

        if (!newDeployment.spec.template.spec.containers[0].env) {
          newDeployment.spec.template.spec.containers[0].env = [];
        }
        // 处理没有环境变量的情况


        const hasIns = yaml.items.findIndex(
            (          x: { kind: string; metadata: { name: string; }; }) =>
            x.kind &&
            (x.kind === 'Deployment' ||
              x.kind === 'StatefulSet' ||
              x.kind === 'Job' ||
              x.kind === 'DaemonSet' ||
              x.kind === 'CronJob') &&
            x.metadata &&
            x.metadata.name &&
            x.metadata.name === `${this.serviceName}`,
        );
        if (
          !yamlData ||
          (!(deploy && deploy.length > 0) && (!yamlData || hasIns === -1) && !(allDeploy && allDeploy.length === 1))
        ) {
          yaml.items.push(newDeployment);
        }
      }
    }

    yaml.items.forEach((y: { metadata: { labels: { service?: any; fromPlatform?: any; fromApp?: any; initComponent?: any; }; }; }) => {
      if (!y.metadata.labels) y.metadata.labels = {};
      y.metadata.labels.service = appName;
      y.metadata.labels.fromPlatform = 'demo';
      y.metadata.labels.fromApp = this.appInfo.fromApp;
      if (this.args.isInitTemplate) {
        y.metadata.labels.initComponent = this.args.initLevel;
      } else {
        delete y.metadata.labels.initComponent;
      }
    });

    return yaml;
  }

  /**
   * 移除 envs
   * @param yamlItems
   * @param remove_envs
   * @param serviceName
   * @returns
   */
  removeEnvs(yamlItems: any, remove_envs: Array<any>, serviceName: string): void {
    if (yamlItems == null) {
      return;
    }
    yamlItems.forEach((yaml: { spec: { template: { spec: { containers: { env: any[]; }[]; }; }; }; }, index: any, arrs: any) => {
      try {
        let envs = yaml.spec.template.spec.containers[0].env;
        envs = envs.filter(item_env => {
          const index_env = remove_envs.findIndex(
            q => q.key == item_env.name && this.keyEnv(q, serviceName) == item_env.value.trim(),
          );
          return index_env < 0;
        });
        yaml.spec.template.spec.containers[0].env = [...envs];
      } catch (error:any) {
        console.log(error.message);
      }
    });
  }

  /**
   * 获取 env key 去除空格
   * @param item
   * @param serviceName
   * @returns
   */
  keyEnv(item: any, serviceName: string): string {
    const env = `${serviceName}.${ConfigNodeKeyName.env}.${item.key}`;
    return `{{${item.routekey == '' ? env : item.routekey}}}`.trim();
  }

  /**
   * 查看metedata 数据
   */
  findData(key: string, data?: any, dataSource: Array<any> = []) {
    let source: Array<any> = [];
    if (dataSource.length > 0) {
      source = dataSource;
    }
    if (data !== null) {
      source.push(data);
    }
    return this.findNode(source, key);
  }

  /**
   * 查找 metedata 节点
   * @param formService
   * @param key
   * @returns
   */
  findNode(formService: Array<any>, key: string):any {
    let routekeys: Array<string> = [];
    const unique_arrs = formService;
    for (let i = 0; i < unique_arrs.length; i++) {
      const node = unique_arrs[i];
      const iskey_empty = typeof node.key === 'undefined' || node.key === '';
      const key_ = key.replace(/\.+/g, '-');

      if (!iskey_empty) {
        node.key = node.key.replace(/\.+/g, '-');
        if (node.key === key_) {
          return {
            arr: [node.key],
            routekey: node.key,
            data: node,
          };
        }
      }
      if (node.type === 'array') {
        const _node = this.findNode(node.properties, key);
        if (_node.arr.length > 0) {
          if (!iskey_empty) {
            routekeys.push(node.key.replace(/\.+/g, '-'));
          }
          routekeys = routekeys.concat(_node.arr);
        }
        if (_node.data !== null) {
          return {
            arr: routekeys,
            routekey: routekeys.join('.'),
            data: _node.data,
          };
        }
      }
    }
    return {
      arr: routekeys,
      routekey: '',
      data: null,
    };
  }

  // 序列化 格式 防止数据缺失
  initProperties(dataSource: Array<any>) {
    for (let index = 0; index < dataSource.length; index++) {
      const current = dataSource[index];
      if (current.type === 'array') {
        if (!current.properties) {
          current.properties = [];
        } else {
          this.initProperties(current.properties);
        }
      }
    }
    return dataSource;
  }



  /**
   * 去除头部空白函数
   * @param str
   * @param c
   * @returns
   */
  trimStart(str:string, c = '') {
    str = `${str}`;
    if (c == null || c == '') {
      var str = str.replace(/^s*/, '');
      return str;
    } else {
      var rg = new RegExp('^' + c + '*');
      var str = str.replace(rg, '');
      return str;
    }
  }
}
export enum ConfigNodeKeyName {
  env = 'envs',
  port = 'ports',
  version = 'version',
  images = 'images',
  repoUrl = 'repoUrl',
  externalRegistry = 'externalRegistry',
}

export enum ConfigDeployNodeKeyName {
  dBconstr = 'ENVDBCONSTR',
  endpoint = 'endpoint',
  initTag = 'init-image',
}
